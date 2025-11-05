import fs from 'fs';
import multer from 'multer';
import path from 'path';

const UPLOAD_DIR = process.env.SHARED_UPLOADS_DIR || path.resolve(__dirname, '../../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    // TODO: add even safer filename handling
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

// Create the multer instance that will handle a single file upload with the field name 'audio'
const upload = multer({ storage });

export default upload;
