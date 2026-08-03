const ColdContact = require("../models/ColdContact");
const ColdCampaign = require("../models/ColdCampaign");
const ColdMailbox = require("../models/ColdMailbox");
const ColdSend = require("../models/ColdSend");
const ColdSuppressionList = require("../models/ColdSuppressionList");

// GET /api/cold-email/stats
const getStats = async (req, res) => {
  try {
    const [contacts, activeContacts, campaigns, activeCampaigns, mailboxes, sends, replied, suppressed] =
      await Promise.all([
        ColdContact.countDocuments(),
        ColdContact.countDocuments({ status: "active" }),
        ColdCampaign.countDocuments(),
        ColdCampaign.countDocuments({ status: "active" }),
        ColdMailbox.countDocuments({ status: "active" }),
        ColdSend.countDocuments({ status: "sent" }),
        ColdSend.countDocuments({ status: "replied" }),
        ColdSuppressionList.countDocuments(),
      ]);

    res.json({
      success: true,
      stats: { contacts, activeContacts, campaigns, activeCampaigns, mailboxes, sends, replied, suppressed },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getStats };
