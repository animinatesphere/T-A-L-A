const ColdCampaign = require("../models/ColdCampaign");
const ColdContact = require("../models/ColdContact");
const ColdSend = require("../models/ColdSend");
const ColdSuppressionList = require("../models/ColdSuppressionList");
const { processColdEmailSends, detectReplies } = require("../utils/coldEmailEngine");

// GET /api/cold-email/campaigns
const listCampaigns = async (req, res) => {
  try {
    const campaigns = await ColdCampaign.find().sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/campaigns
const createCampaign = async (req, res) => {
  try {
    const { name, fromName, steps, mailboxIds, contactIds } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "Campaign name is required" });

    const campaign = await ColdCampaign.create({
      name,
      fromName: fromName || "",
      steps: (steps || []).map((s, i) => ({ ...s, order: i })),
      mailboxIds: mailboxIds || [],
      contactIds: contactIds || [],
    });
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/cold-email/campaigns/:id
const getCampaign = async (req, res) => {
  try {
    const campaign = await ColdCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });

    const breakdown = await ColdSend.aggregate([
      { $match: { campaignId: campaign._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const sendBreakdown = breakdown.reduce((acc, b) => ({ ...acc, [b._id]: b.count }), {});

    res.json({ success: true, campaign, sendBreakdown });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/cold-email/campaigns/:id
const updateCampaign = async (req, res) => {
  try {
    const { name, fromName, steps, mailboxIds, contactIds } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (fromName !== undefined) update.fromName = fromName;
    if (steps !== undefined) update.steps = steps.map((s, i) => ({ ...s, order: i }));
    if (mailboxIds !== undefined) update.mailboxIds = mailboxIds;
    if (contactIds !== undefined) update.contactIds = contactIds;

    const campaign = await ColdCampaign.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/cold-email/campaigns/:id
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await ColdCampaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });
    await ColdSend.deleteMany({ campaignId: campaign._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/campaigns/:id/launch
const launchCampaign = async (req, res) => {
  try {
    const campaign = await ColdCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });
    if (!campaign.steps.length) return res.status(400).json({ success: false, error: "Campaign has no steps" });
    if (!campaign.mailboxIds.length)
      return res.status(400).json({ success: false, error: "Campaign has no connected mailboxes" });
    if (!campaign.contactIds.length)
      return res.status(400).json({ success: false, error: "Campaign has no contacts" });

    const suppressed = new Set(
      (await ColdSuppressionList.find({}).select("email").lean()).map((s) => s.email)
    );
    const contacts = await ColdContact.find({
      _id: { $in: campaign.contactIds },
      status: "active",
    }).lean();
    const eligible = contacts.filter((c) => !suppressed.has(c.email));

    if (!eligible.length)
      return res.status(400).json({ success: false, error: "No eligible (active, non-suppressed) contacts" });

    const sendDocs = eligible.map((contact, i) => ({
      campaignId: campaign._id,
      contactId: contact._id,
      contactEmail: contact.email,
      stepIndex: 0,
      status: "pending",
      scheduledAt: new Date(Date.now() + i * 10_000 + Math.random() * 5_000),
    }));
    await ColdSend.insertMany(sendDocs, { ordered: false }).catch(() => {});

    campaign.status = "active";
    campaign.launchedAt = new Date();
    await campaign.save();

    setImmediate(async () => {
      try {
        await processColdEmailSends();
      } catch (e) {
        console.error("Post-launch send error:", e.message);
      }
    });

    res.json({ success: true, campaign, scheduled: sendDocs.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/campaigns/:id/pause
const pauseCampaign = async (req, res) => {
  try {
    const campaign = await ColdCampaign.findByIdAndUpdate(req.params.id, { status: "paused" }, { new: true });
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/campaigns/:id/resume
const resumeCampaign = async (req, res) => {
  try {
    const campaign = await ColdCampaign.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });
    setImmediate(async () => {
      try {
        await processColdEmailSends();
      } catch (e) {
        console.error("Post-resume send error:", e.message);
      }
    });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/cold-email/campaigns/:id/sends?page&limit&status
const getCampaignSends = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 25);
    const filter = { campaignId: req.params.id };
    if (req.query.status) filter.status = req.query.status;

    const [sends, total] = await Promise.all([
      ColdSend.find(filter)
        .populate("contactId", "email firstName lastName company")
        .populate("mailboxId", "email")
        .sort({ scheduledAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ColdSend.countDocuments(filter),
    ]);

    res.json({ success: true, sends, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/cold-email/replies?page&limit
const listAllReplies = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 25);
    const filter = { status: "replied" };

    const [sends, total] = await Promise.all([
      ColdSend.find(filter)
        .populate("contactId", "email firstName lastName company")
        .populate("campaignId", "name")
        .sort({ repliedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ColdSend.countDocuments(filter),
    ]);

    res.json({ success: true, replies: sends, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/campaigns/:id/check-replies
const checkReplies = async (req, res) => {
  try {
    const campaign = await ColdCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, error: "Campaign not found" });
    await detectReplies();
    const repliedCount = await ColdSend.countDocuments({ campaignId: campaign._id, status: "replied" });
    res.json({ success: true, repliedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/replies/check
const checkAllReplies = async (req, res) => {
  try {
    await detectReplies();
    const repliedCount = await ColdSend.countDocuments({ status: "replied" });
    res.json({ success: true, repliedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  listCampaigns,
  createCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  launchCampaign,
  pauseCampaign,
  resumeCampaign,
  getCampaignSends,
  checkReplies,
  listAllReplies,
  checkAllReplies,
};
