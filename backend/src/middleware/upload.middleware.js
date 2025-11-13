// backend/src/middleware/upload.middleware.js
// Multer config for image uploads

const multer = require('multer');
const { MAX_FILES, MAX_FILE_SIZE_BYTES } = require('../config');

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  return cb(new Error('Only image files are allowed'));
}

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
});
