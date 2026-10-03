const Submission = require('../models/Submission');
const fs = require('fs');
const path = require('path');

const verifyPayment = async (reference, requestedCurrency) => {
  const currency = String(requestedCurrency || '').toUpperCase();
  let provider;
  let secretKey;
  let verificationUrl;

  if (currency === 'NGN') {
    provider = 'paystack';
    secretKey = process.env.PAYSTACK_SECRET_KEY;
    verificationUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
  } else if (currency === 'USD') {
    provider = 'flutterwave';
    secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    verificationUrl = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`;
  } else {
    const error = new Error('Unsupported payment currency.');
    error.statusCode = 400;
    throw error;
  }

  if (!secretKey) {
    const error = new Error(`${provider} secret key is not configured.`);
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(verificationUrl, {
    headers: { Authorization: `Bearer ${secretKey}` }
  });
  const result = await response.json().catch(() => null);
  const transaction = result?.data;
  const verifiedReference = provider === 'paystack' ? transaction?.reference : transaction?.tx_ref;
  const validStatus = provider === 'paystack'
    ? result?.status === true && transaction?.status === 'success'
    : result?.status === 'success' && transaction?.status === 'successful';
  const validAmount = provider === 'paystack'
    ? Number(transaction?.amount) === 2000000
    : Number(transaction?.amount) === 50;

  if (
    !response.ok ||
    !validStatus ||
    !validAmount ||
    transaction?.currency !== currency ||
    verifiedReference !== reference
  ) {
    return null;
  }

  return {
    payment_status: 'completed',
    payment_amount: Number(transaction.amount),
    payment_currency: transaction.currency,
    payment_reference: verifiedReference
  };
};

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Public
const createSubmission = async (req, res) => {
  try {
    const paymentReference = String(req.body.payment_reference || '').trim();
    if (!paymentReference) {
      return res.status(400).json({ success: false, error: 'Payment reference is required.' });
    }

    let verifiedPayment;
    try {
      verifiedPayment = await verifyPayment(paymentReference, req.body.payment_currency);
    } catch (error) {
      return res.status(error.statusCode || 502).json({
        success: false,
        error: error.statusCode ? error.message : 'Unable to verify payment with the provider.'
      });
    }

    if (!verifiedPayment) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed. Confirm the payment amount, currency, and status.'
      });
    }

    const submissionData = { ...req.body, ...verifiedPayment };
    
    // Files are handled by multer and URLs should be passed in the body or extracted from req.files
    // In this unified approach, req.files will contain the file info
    if (req.files) {
      if (req.files.book_cover) {
        submissionData.cover_image_url = `/uploads/images/${req.files.book_cover[0].filename}`;
      }
      if (req.files.author_image) {
        submissionData.author_image_url = `/uploads/images/${req.files.author_image[0].filename}`;
      }
      if (req.files.about_book_pdf) {
        submissionData.about_book_pdf_url = `/uploads/documents/${req.files.about_book_pdf[0].filename}`;
      }
      if (req.files.ebook) {
        submissionData.ebook_url = `/uploads/documents/${req.files.ebook[0].filename}`;
      }
    }

    const submission = await Submission.create(submissionData);
    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    if (
      error.code === 11000 &&
      (error.keyPattern?.payment_reference || error.keyValue?.payment_reference !== undefined)
    ) {
      return res.status(409).json({
        success: false,
        error: 'This payment reference has already been used.'
      });
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update submission status
// @route   PATCH /api/submissions/:id
// @access  Private/Admin
const updateSubmissionStatus = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private/Admin
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Delete files from local storage if they exist
    const filesToDelete = [
      submission.cover_image_url,
      submission.author_image_url,
      submission.about_book_pdf_url,
      submission.ebook_url
    ];

    filesToDelete.forEach(fileUrl => {
      if (fileUrl && fileUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
  deleteSubmission
};
