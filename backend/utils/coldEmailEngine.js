const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const ColdMailbox = require("../models/ColdMailbox");
const ColdContact = require("../models/ColdContact");
const ColdCampaign = require("../models/ColdCampaign");
const ColdSend = require("../models/ColdSend");
const ColdSuppressionList = require("../models/ColdSuppressionList");

// -- Token encryption (AES-256-GCM) ------------------------------------------
const RAW_KEY = process.env.COLD_EMAIL_ENCRYPTION_KEY || "dev_cold_email_key_32chars_pad00";
const ENC_KEY = crypto.createHash("sha256").update(RAW_KEY).digest();

function encrypt(text) {
  if (!text) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${enc.toString("hex")}`;
}

function decrypt(encText) {
  if (!encText) return "";
  const [ivHex, tagHex, encHex] = encText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const enc = Buffer.from(encHex, "hex");
  const dec = crypto.createDecipheriv("aes-256-gcm", ENC_KEY, iv);
  dec.setAuthTag(tag);
  return Buffer.concat([dec.update(enc), dec.final()]).toString("utf8");
}

// -- Gmail OAuth client -------------------------------------------------------
const REDIRECT_URI = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/cold-email/auth/callback`;

function buildOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

async function getGmailClient(mailbox) {
  const oauth2 = buildOAuth2Client();
  oauth2.setCredentials({
    access_token: decrypt(mailbox.accessToken),
    refresh_token: decrypt(mailbox.refreshToken),
    expiry_date: mailbox.tokenExpiry ? mailbox.tokenExpiry.getTime() : undefined,
  });
  oauth2.on("tokens", async (tokens) => {
    const update = {};
    if (tokens.access_token) update.accessToken = encrypt(tokens.access_token);
    if (tokens.expiry_date) update.tokenExpiry = new Date(tokens.expiry_date);
    if (Object.keys(update).length) {
      await ColdMailbox.findByIdAndUpdate(mailbox._id, update);
    }
  });
  return google.gmail({ version: "v1", auth: oauth2 });
}

// -- Send via Gmail API --------------------------------------------------------
async function sendViaGmail(mailbox, { to, subject, html, fromName }) {
  const gmail = await getGmailClient(mailbox);
  const from = fromName ? `${fromName} <${mailbox.email}>` : mailbox.email;
  const mime = [
    `MIME-Version: 1.0`,
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    html,
  ].join("\r\n");
  const raw = Buffer.from(mime)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const result = await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
  return result.data;
}

// -- Template personalization --------------------------------------------------
// Supported merge tags: {{first_name}} {{last_name}} {{full_name}} {{company}} {{email}}
function personalizeTemplate(template, contact) {
  const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
  return template
    .replace(/\{\{first_name\}\}/gi, contact.firstName || "")
    .replace(/\{\{last_name\}\}/gi, contact.lastName || "")
    .replace(/\{\{full_name\}\}/gi, fullName)
    .replace(/\{\{company\}\}/gi, contact.company || "")
    .replace(/\{\{email\}\}/gi, contact.email || "");
}

// -- HTML email wrapper ---------------------------------------------------------
// Wraps plain text (or HTML body) in a branded (T.A.L.A. wine palette) email template.
// Includes a prominent "Reply Now" mailto button so prospects reply with one click.
function buildEmailHtml(rawBody, unsubUrl, replySubject) {
  if (/<html|<!DOCTYPE/i.test(rawBody)) return rawBody; // already full HTML

  const hasHtml = /<[a-z][\s\S]*>/i.test(rawBody);
  const content = hasHtml
    ? rawBody
    : rawBody
        .split(/\n/)
        .map((line) =>
          line.trim()
            ? `<tr><td style="padding:0 0 6px;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.7;">${line}</td></tr>`
            : `<tr><td style="height:10px;font-size:10px;line-height:10px;">&nbsp;</td></tr>`
        )
        .join("\n");

  const replySubEnc = encodeURIComponent("Re: " + (replySubject || "Your message"));
  const replyBodyEnc = encodeURIComponent(
    "Hi,\n\nI'm interested in learning more. Please get in touch.\n\nKind regards,"
  );
  const replyHref = `mailto:info@theafricalaureateawards.org?subject=${replySubEnc}&body=${replyBodyEnc}`;

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;padding:0;background:#edf1f7;-webkit-font-smoothing:antialiased}a{color:#6B0C22;text-decoration:none}
@media only screen and (max-width:620px){.wrapper{width:100%!important}.inner{padding:28px 20px!important}.hdr{padding:24px 20px!important}}
</style></head>
<body style="margin:0;padding:0;background:#edf1f7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#edf1f7;">
<tr><td align="center" style="padding:40px 12px 48px;">
<table class="wrapper" role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

  <!-- Header -->
  <tr><td class="hdr" align="center" style="background:linear-gradient(135deg,#6B0C22 0%,#4A0818 100%);border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
    <p style="margin:0;color:#fff;font-family:Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:0.5px;">T.A.L.A.</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.55);font-family:Arial,sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">The Africa Laureate Awards</p>
  </td></tr>

  <!-- Gradient bar -->
  <tr><td style="height:4px;background:linear-gradient(90deg,#6B0C22 0%,#8B1530 60%,#4A0818 100%);font-size:0;">&nbsp;</td></tr>

  <!-- Body -->
  <tr><td class="inner" style="background:#fff;padding:40px 40px 32px;border-left:1px solid #dde5ed;border-right:1px solid #dde5ed;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${content}</table>
  </td></tr>

  <!-- Reply CTA button -->
  <tr><td style="background:#fff;border-left:1px solid #dde5ed;border-right:1px solid #dde5ed;padding:4px 40px 28px;text-align:center;">
    <a href="${replyHref}" style="display:inline-block;background:#6B0C22;color:#fff;font-family:Arial,sans-serif;font-size:14px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:50px;border:2px solid #8B1530;">&#9993;&nbsp; Yes, I'm Interested — Reply Now</a>
    <p style="margin:10px 0 0;color:#94a3b8;font-family:Arial,sans-serif;font-size:11px;">Clicking this opens your email client with a pre-filled reply</p>
  </td></tr>

  <!-- Divider -->
  <tr><td style="background:#fff;border-left:1px solid #dde5ed;border-right:1px solid #dde5ed;padding:0 40px;">
    <div style="height:1px;background:#e2e8f0;">&nbsp;</div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f8fafc;border:1px solid #dde5ed;border-top:none;border-radius:0 0 16px 16px;padding:22px 40px 24px;text-align:center;">
    <p style="margin:0 0 8px;color:#94a3b8;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;">You received this because you're on our outreach list.</p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;">
      <a href="${unsubUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
      &nbsp;&nbsp;&middot;&nbsp;&nbsp;
      <a href="https://www.theafricalaureateawards.org" style="color:#64748b;">theafricalaureateawards.org</a>
    </p>
  </td></tr>

</table></td></tr></table>
</body></html>`;
}

// -- Daily counter reset ---------------------------------------------------------
async function resetDailyCounters() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await ColdMailbox.updateMany(
    { lastResetDate: { $lt: today } },
    { $set: { sentToday: 0, lastResetDate: new Date() } }
  );
}

// -- Pick an available mailbox (one with remaining daily capacity) ---------------
async function pickMailbox(mailboxIds) {
  const boxes = await ColdMailbox.find({ _id: { $in: mailboxIds }, status: "active" });
  for (const box of boxes) {
    if (box.sentToday < box.dailyLimit) return box;
  }
  return null;
}

// -- Schedule the next step for a contact -----------------------------------------
async function scheduleNextStep(send, campaign) {
  const nextIdx = send.stepIndex + 1;
  if (nextIdx >= campaign.steps.length) return;
  const nextStep = campaign.steps[nextIdx];
  const base = new Date();
  base.setDate(base.getDate() + (nextStep.waitDays || 1));
  base.setHours(9 + Math.floor(Math.random() * 7), Math.floor(Math.random() * 60), 0, 0);
  const exists = await ColdSend.findOne({
    campaignId: send.campaignId,
    contactId: send.contactId,
    stepIndex: nextIdx,
  });
  if (exists) return;
  await ColdSend.create({
    campaignId: send.campaignId,
    contactId: send.contactId,
    contactEmail: send.contactEmail,
    stepIndex: nextIdx,
    status: "pending",
    scheduledAt: base,
  });
}

// -- Process a single send record ----------------------------------------------
async function processSingleSend(send) {
  const campaign = await ColdCampaign.findById(send.campaignId);
  if (!campaign || campaign.status !== "active")
    return ColdSend.findByIdAndUpdate(send._id, { status: "skipped", error: "Campaign not active" });

  const suppressed = await ColdSuppressionList.findOne({ email: send.contactEmail });
  if (suppressed) return ColdSend.findByIdAndUpdate(send._id, { status: "skipped", error: "Suppressed" });

  const contact = await ColdContact.findById(send.contactId);
  if (!contact || contact.status !== "active")
    return ColdSend.findByIdAndUpdate(send._id, { status: "skipped", error: "Contact inactive" });

  const mailbox = await pickMailbox(campaign.mailboxIds);
  if (!mailbox) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60), 0, 0);
    return ColdSend.findByIdAndUpdate(send._id, { scheduledAt: tomorrow });
  }

  const step = campaign.steps[send.stepIndex];
  if (!step) return ColdSend.findByIdAndUpdate(send._id, { status: "skipped", error: "Step missing" });

  const subject = personalizeTemplate(step.subject, contact);
  const body = personalizeTemplate(step.body, contact);
  const unsubToken = jwt.sign(
    { email: contact.email, campaignId: send.campaignId.toString() },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "90d" }
  );
  const unsubUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/cold-email/unsubscribe/${unsubToken}`;
  const fullHtml = buildEmailHtml(body, unsubUrl, subject);

  if (process.env.COLD_EMAIL_DRY_RUN === "true") {
    console.log(`[DRY RUN] -> ${contact.email} | Step ${send.stepIndex + 1} | "${subject}"`);
    await ColdSend.findByIdAndUpdate(send._id, { status: "sent", sentAt: new Date(), mailboxId: mailbox._id });
    await ColdMailbox.findByIdAndUpdate(mailbox._id, { $inc: { sentToday: 1 } });
    await ColdCampaign.findByIdAndUpdate(send.campaignId, { $inc: { "stats.sent": 1 } });
    await scheduleNextStep(send, campaign);
    return;
  }

  const result = await sendViaGmail(mailbox, {
    to: contact.email,
    subject,
    html: fullHtml,
    fromName: campaign.fromName || "",
  });

  await ColdSend.findByIdAndUpdate(send._id, {
    status: "sent",
    sentAt: new Date(),
    mailboxId: mailbox._id,
    gmailMessageId: result.id,
    gmailThreadId: result.threadId,
  });
  await ColdMailbox.findByIdAndUpdate(mailbox._id, { $inc: { sentToday: 1 } });
  await ColdCampaign.findByIdAndUpdate(send.campaignId, { $inc: { "stats.sent": 1 } });
  await scheduleNextStep(send, campaign);
}

// -- Main send processor (called on a timer every 2 minutes) --------------------
let sendRunning = false;
async function processColdEmailSends() {
  if (sendRunning) return;
  sendRunning = true;
  try {
    await resetDailyCounters();
    const now = new Date();
    const pending = await ColdSend.find({ status: "pending", scheduledAt: { $lte: now } })
      .sort({ scheduledAt: 1 })
      .limit(150)
      .lean();

    const CONCURRENCY = 5;
    for (let i = 0; i < pending.length; i += CONCURRENCY) {
      const chunk = pending.slice(i, i + CONCURRENCY);
      await Promise.all(
        chunk.map(async (send) => {
          try {
            await processSingleSend(send);
          } catch (err) {
            console.error(`Send error (${send.contactEmail}):`, err.message);
            await ColdSend.findByIdAndUpdate(send._id, { status: "failed", error: err.message });
            if (err.message?.includes("invalid_grant") || err.message?.includes("Invalid Credentials")) {
              if (send.mailboxId)
                await ColdMailbox.findByIdAndUpdate(send.mailboxId, { status: "error", errorMessage: err.message });
            }
          }
        })
      );
    }
  } finally {
    sendRunning = false;
  }
}

// -- Reply detection (runs every ~10 minutes) ------------------------------------
function b64Decode(data) {
  if (!data) return "";
  try {
    return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  } catch {
    return "";
  }
}

function extractGmailBody(payload, depth = 0) {
  if (!payload || depth > 6) return "";
  if (payload.body?.data) {
    const text = b64Decode(payload.body.data);
    if (text.trim()) return text;
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      const text = extractGmailBody(part, depth + 1);
      if (text.trim()) return text;
    }
  }
  return "";
}

async function detectRepliesForMailbox(mailbox) {
  const gmail = await getGmailClient(mailbox);
  const sentSends = await ColdSend.find({
    mailboxId: mailbox._id,
    status: "sent",
    gmailThreadId: { $exists: true, $ne: null },
  })
    .limit(200)
    .lean();

  for (const send of sentSends) {
    try {
      const thread = await gmail.users.threads.get({ userId: "me", id: send.gmailThreadId });
      const messages = thread.data.messages || [];
      if (messages.length < 2) continue;

      const reply = messages.find((m) => m.id !== send.gmailMessageId);
      if (!reply) continue;

      const headers = reply.payload?.headers || [];
      const fromHeader = headers.find((h) => h.name.toLowerCase() === "from");
      const subHeader = headers.find((h) => h.name.toLowerCase() === "subject");
      const replyFrom = fromHeader?.value || "";
      const replySubject = subHeader?.value || "";
      const replyBody = extractGmailBody(reply.payload);

      await ColdSend.findByIdAndUpdate(send._id, {
        status: "replied",
        repliedAt: new Date(),
        replyFrom,
        replySubject,
        replyBody: replyBody.slice(0, 2000),
      });
      await ColdCampaign.findByIdAndUpdate(send.campaignId, { $inc: { "stats.replied": 1 } });
    } catch {
      /* skip individual thread errors */
    }
  }
}

let replyRunning = false;
async function detectReplies() {
  if (replyRunning) return;
  replyRunning = true;
  try {
    const mailboxes = await ColdMailbox.find({ status: "active" });
    for (const mailbox of mailboxes) {
      try {
        await detectRepliesForMailbox(mailbox);
      } catch (err) {
        console.error(`Reply detect error (${mailbox.email}):`, err.message);
      }
    }
  } finally {
    replyRunning = false;
  }
}

module.exports = {
  encrypt,
  decrypt,
  buildOAuth2Client,
  REDIRECT_URI,
  processColdEmailSends,
  detectReplies,
  buildEmailHtml,
};
