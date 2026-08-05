const { parse } = require("csv-parse/sync");
const ColdContact = require("../models/ColdContact");
const ColdSuppressionList = require("../models/ColdSuppressionList");

const PAGE_SIZE = 25;

// GET /api/cold-email/contacts?page&limit&search
const listContacts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || PAGE_SIZE);
    const search = (req.query.search || "").trim();
    const status = (req.query.status || "").trim();

    const filter = {};
    if (status === "active" || status === "suppressed") filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { bookName: { $regex: search, $options: "i" } },
      ];
    }

    const [contacts, total, activeCount, suppressedCount] = await Promise.all([
      ColdContact.find(filter)
        .sort({ importedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ColdContact.countDocuments(filter),
      ColdContact.countDocuments({ status: "active" }),
      ColdContact.countDocuments({ status: "suppressed" }),
    ]);

    res.json({
      success: true,
      contacts,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      counts: { active: activeCount, suppressed: suppressedCount, total: activeCount + suppressedCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/cold-email/contacts/all-ids?search
const allContactIds = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const status = (req.query.status || "").trim();
    const filter = {};
    if (status === "active" || status === "suppressed") filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { bookName: { $regex: search, $options: "i" } },
      ];
    }
    const ids = await ColdContact.find(filter).select("_id").lean();
    res.json({ success: true, ids: ids.map((c) => c._id) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const normalizeHeader = (h) => h.toLowerCase().replace(/[\s_-]/g, "");

function mapRow(row) {
  const mapped = { extraFields: {} };
  for (const [rawKey, rawValue] of Object.entries(row)) {
    const key = normalizeHeader(rawKey);
    const value = (rawValue || "").toString().trim();
    if (!value) continue;

    if (!mapped.email && key.includes("email")) {
      mapped.email = value.toLowerCase();
    } else if (key === "firstname") {
      mapped.firstName = value;
    } else if (key === "lastname") {
      mapped.lastName = value;
    } else if (
      !mapped._fullName &&
      (key === "fullname" || key === "prospectfullname" || key === "authorname" || key === "author")
    ) {
      mapped._fullName = value;
    } else if (key === "company" || key === "companyname" || key === "prospectcompanyname") {
      mapped.company = value;
    } else if (
      key === "bookname" ||
      key === "booktitle" ||
      key === "book" ||
      key === "prospectbookname" ||
      key === "prospectbooktitle"
    ) {
      mapped.bookName = value;
    } else {
      mapped.extraFields[rawKey] = value;
    }
  }
  if (mapped._fullName && !mapped.firstName && !mapped.lastName) {
    const parts = mapped._fullName.split(/\s+/);
    mapped.firstName = parts[0] || "";
    mapped.lastName = parts.slice(1).join(" ") || "";
  }
  delete mapped._fullName;
  return mapped;
}

// POST /api/cold-email/contacts/import  (multipart, field "file")
const importContacts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No CSV file uploaded" });

    const records = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
    const importBatch = `import-${Date.now()}`;

    let invalid = 0;
    const seen = new Set();
    const docs = [];
    for (const row of records) {
      const mapped = mapRow(row);
      if (!mapped.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mapped.email)) {
        invalid++;
        continue;
      }
      if (seen.has(mapped.email)) continue;
      seen.add(mapped.email);
      docs.push({
        email: mapped.email,
        firstName: mapped.firstName || "",
        lastName: mapped.lastName || "",
        company: mapped.company || "",
        bookName: mapped.bookName || "",
        extraFields: mapped.extraFields,
        importBatch,
      });
    }

    let imported = 0;
    if (docs.length) {
      try {
        const result = await ColdContact.insertMany(docs, { ordered: false });
        imported = result.length;
      } catch (bulkError) {
        imported = bulkError.insertedDocs?.length || 0;
      }
    }
    const duplicates = Math.max(0, records.length - imported - invalid);

    res.json({ success: true, imported, duplicates, invalid, total: records.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/cold-email/contacts
const addContact = async (req, res) => {
  try {
    const { email, firstName, lastName, company, bookName } = req.body;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });

    const contact = await ColdContact.create({
      email: email.toLowerCase().trim(),
      firstName: firstName || "",
      lastName: lastName || "",
      company: company || "",
      bookName: bookName || "",
      importBatch: "manual",
    });
    res.status(201).json({ success: true, contact });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, error: "Contact already exists" });
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/cold-email/contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await ColdContact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, error: "Contact not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/cold-email/contacts  (body: { ids: [] })
const bulkDeleteContacts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.length)
      return res.status(400).json({ success: false, error: "ids array is required" });
    const result = await ColdContact.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  listContacts,
  allContactIds,
  importContacts,
  addContact,
  deleteContact,
  bulkDeleteContacts,
};
