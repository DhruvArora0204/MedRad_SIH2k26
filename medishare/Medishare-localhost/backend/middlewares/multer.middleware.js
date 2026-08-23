import multer from 'multer';
import path from 'path';
import fs from 'fs';
const uploadPath = path.join(process.cwd(), "backend", "public");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const newFileName = `report${fileExtension}`;
    cb(null, newFileName);
  }
});
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only PDF files are allowed.'));
  }
  cb(null, true); 
};

const limits = {
  fileSize: 10 * 1024 * 1024, 
};

const upload = multer({ storage, fileFilter, limits });

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

export { upload, multerErrorHandler };
