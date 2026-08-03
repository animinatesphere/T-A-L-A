const { google } = require("googleapis");
const ColdMailbox = require("../models/ColdMailbox");
const { encrypt, buildOAuth2Client } = require("../utils/coldEmailEngine");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

// GET /api/cold-email/auth/google
const getGoogleAuthUrl = (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({
      success: false,
      error: "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the backend .env file.",
    });
  }
  const oauth2 = buildOAuth2Client();
  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
  res.redirect(url);
};

// GET /api/cold-email/auth/callback (public - Google redirects here)
const googleAuthCallback = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const { code } = req.query;
    if (!code) throw new Error("Missing authorization code");

    const oauth2 = buildOAuth2Client();
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);

    const oauth2Api = google.oauth2({ version: "v2", auth: oauth2 });
    const { data: profile } = await oauth2Api.userinfo.get();
    if (!profile.email) throw new Error("Could not read Gmail address from Google profile");

    const update = {
      email: profile.email.toLowerCase(),
      accessToken: encrypt(tokens.access_token),
      status: "active",
      errorMessage: "",
    };
    if (tokens.refresh_token) update.refreshToken = encrypt(tokens.refresh_token);
    if (tokens.expiry_date) update.tokenExpiry = new Date(tokens.expiry_date);

    await ColdMailbox.findOneAndUpdate({ email: update.email }, update, { upsert: true, new: true, setDefaultsOnInsert: true });

    res.redirect(`${frontendUrl}/Tala-admin/cold-email/mailboxes?connected=1`);
  } catch (error) {
    console.error("Google auth callback error:", error.message);
    res.redirect(`${frontendUrl}/Tala-admin/cold-email/mailboxes?error=${encodeURIComponent(error.message)}`);
  }
};

// GET /api/cold-email/mailboxes
const listMailboxes = async (req, res) => {
  try {
    const mailboxes = await ColdMailbox.find().select("-accessToken -refreshToken").sort({ createdAt: -1 });
    res.json({ success: true, mailboxes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PATCH /api/cold-email/mailboxes/:id
const updateMailbox = async (req, res) => {
  try {
    const update = {};
    if (req.body.dailyLimit !== undefined) update.dailyLimit = Number(req.body.dailyLimit);
    if (req.body.status !== undefined) update.status = req.body.status;
    const mailbox = await ColdMailbox.findByIdAndUpdate(req.params.id, update, { new: true }).select(
      "-accessToken -refreshToken"
    );
    if (!mailbox) return res.status(404).json({ success: false, error: "Mailbox not found" });
    res.json({ success: true, mailbox });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/cold-email/mailboxes/:id
const deleteMailbox = async (req, res) => {
  try {
    const mailbox = await ColdMailbox.findByIdAndDelete(req.params.id);
    if (!mailbox) return res.status(404).json({ success: false, error: "Mailbox not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getGoogleAuthUrl,
  googleAuthCallback,
  listMailboxes,
  updateMailbox,
  deleteMailbox,
};
