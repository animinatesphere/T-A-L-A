const jwt = require("jsonwebtoken");
const ColdSuppressionList = require("../models/ColdSuppressionList");
const ColdContact = require("../models/ColdContact");
const ColdSend = require("../models/ColdSend");

// GET /api/cold-email/suppression?page&limit&search
const listSuppression = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 25);
    const search = (req.query.search || "").trim();
    const filter = search ? { email: { $regex: search, $options: "i" } } : {};

    const [entries, total] = await Promise.all([
      ColdSuppressionList.find(filter)
        .sort({ addedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ColdSuppressionList.countDocuments(filter),
    ]);

    res.json({ success: true, entries, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/suppression
const addSuppression = async (req, res) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });
    const normalizedEmail = email.toLowerCase().trim();

    const entry = await ColdSuppressionList.findOneAndUpdate(
      { email: normalizedEmail },
      { email: normalizedEmail, reason: reason || "manual" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await ColdContact.updateMany({ email: normalizedEmail }, { status: "suppressed" });
    res.status(201).json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/cold-email/suppression/:email
const removeSuppression = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    await ColdSuppressionList.deleteOne({ email });
    await ColdContact.updateMany({ email }, { status: "active" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/cold-email/unsubscribe/:token  (public, no auth)
const unsubscribe = async (req, res) => {
  const renderPage = (title, message, ok) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;background:#edf1f7;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}
.card{background:#fff;border-radius:16px;padding:40px;max-width:420px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.1);}
h1{color:${ok ? "#0a6644" : "#b91c1c"};font-size:20px;}p{color:#475569;font-size:14px;line-height:1.6;}</style>
</head><body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`;

  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const email = decoded.email.toLowerCase();

    await ColdSuppressionList.findOneAndUpdate(
      { email },
      { email, reason: "unsubscribed", campaignId: decoded.campaignId },
      { upsert: true, setDefaultsOnInsert: true }
    );
    await ColdContact.updateMany({ email }, { status: "suppressed" });
    await ColdSend.updateMany(
      { contactEmail: email, status: "pending" },
      { status: "skipped", error: "Unsubscribed" }
    );

    res.send(renderPage("You've been unsubscribed", `${email} will no longer receive emails from us.`, true));
  } catch (error) {
    res
      .status(400)
      .send(renderPage("Link invalid or expired", "This unsubscribe link could not be verified.", false));
  }
};

module.exports = {
  listSuppression,
  addSuppression,
  removeSuppression,
  unsubscribe,
};
