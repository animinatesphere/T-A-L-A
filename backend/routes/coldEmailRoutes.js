const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getGoogleAuthUrl,
  googleAuthCallback,
  listMailboxes,
  updateMailbox,
  deleteMailbox,
} = require("../controllers/coldMailboxController");

const {
  listContacts,
  allContactIds,
  importContacts,
  addContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
} = require("../controllers/coldContactController");

const {
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
} = require("../controllers/coldCampaignController");

const {
  listSuppression,
  addSuppression,
  removeSuppression,
  unsubscribe,
} = require("../controllers/coldSuppressionController");

const { getStats } = require("../controllers/coldStatsController");

const csvUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Gmail OAuth (public: initiated from an admin-only UI button, but the
// endpoint itself just redirects to Google's consent screen — no data exposed)
router.get("/auth/google", getGoogleAuthUrl);
router.get("/auth/callback", googleAuthCallback); // public - Google redirects here

// Mailboxes
router.get("/mailboxes", protect, listMailboxes);
router.patch("/mailboxes/:id", protect, updateMailbox);
router.delete("/mailboxes/:id", protect, deleteMailbox);

// Contacts
router.get("/contacts/all-ids", protect, allContactIds);
router.post("/contacts/import", protect, csvUpload.single("file"), importContacts);
router.get("/contacts", protect, listContacts);
router.post("/contacts", protect, addContact);
router.patch("/contacts/:id", protect, updateContact);
router.delete("/contacts/:id", protect, deleteContact);
router.delete("/contacts", protect, bulkDeleteContacts);

// Campaigns
router.get("/campaigns", protect, listCampaigns);
router.post("/campaigns", protect, createCampaign);
router.get("/campaigns/:id", protect, getCampaign);
router.put("/campaigns/:id", protect, updateCampaign);
router.delete("/campaigns/:id", protect, deleteCampaign);
router.post("/campaigns/:id/launch", protect, launchCampaign);
router.post("/campaigns/:id/pause", protect, pauseCampaign);
router.post("/campaigns/:id/resume", protect, resumeCampaign);
router.get("/campaigns/:id/sends", protect, getCampaignSends);
router.post("/campaigns/:id/check-replies", protect, checkReplies);

// Replies (global)
router.get("/replies", protect, listAllReplies);
router.post("/replies/check", protect, checkAllReplies);

// Suppression
router.get("/suppression", protect, listSuppression);
router.post("/suppression", protect, addSuppression);
router.delete("/suppression/:email", protect, removeSuppression);

// Unsubscribe (public)
router.get("/unsubscribe/:token", unsubscribe);

// Stats
router.get("/stats", protect, getStats);

module.exports = router;
