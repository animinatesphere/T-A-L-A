const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 1. Cloudinary Storage (for Images)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'indie-brag/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// 2. Disk Storage (for PDFs/eBooks)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/documents';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Helper function to check file type
const fileFilter = (req, file, cb) => {
  console.log(`Filtering file: ${file.originalname} (field: ${file.fieldname})`);
  
  const imageFields = ['book_cover', 'author_image', 'featured_image', 'cover_image', 'image'];
  const docFields = ['about_book_pdf', 'ebook'];

  if (imageFields.includes(file.fieldname)) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|jfif|heic|heif|tiff|bmp|gif|svg)$/i)) {
      console.error(`Rejected image: ${file.originalname}`);
      return cb(new Error('Please upload an image (jpg, jpeg, png, or webp)'), false);
    }
  } else if (docFields.includes(file.fieldname)) {
    if (!file.originalname.match(/\.(pdf|epub|mobi|docx|doc)$/i)) {
      console.error(`Rejected document: ${file.originalname}`);
      return cb(new Error('Please upload a document (pdf, epub, or mobi)'), false);
    }
  }
  cb(null, true);
};

// Multer instances
const uploadImages = multer({ storage: imageStorage, fileFilter: fileFilter });
const uploadDocs = multer({ storage: diskStorage, fileFilter: fileFilter });

// Unified middleware to handle both types in one request if needed
const uploadFields = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Use absolute path for VPS deployment
      const baseDir = '/var/www/tala/backend';
      let dest = path.join(baseDir, 'uploads/others');
      
      if (file.fieldname === 'book_cover' || file.fieldname === 'author_image' || file.fieldname === 'featured_image' || file.fieldname === 'cover_image' || file.fieldname === 'image') {
        dest = path.join(baseDir, 'uploads/images');
      } else {
        dest = path.join(baseDir, 'uploads/documents');
      }
      
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: fileFilter
});

module.exports = {
  uploadImages,
  uploadDocs,
  uploadFields,
  cloudinary
};
