import multer from 'multer';

const storage = multer.memoryStorage();
const fileUpload = multer({
  storage: storage,
  limits: {
    // Limit file size to 10MB
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only images are allowed!'));
    }
  },
});

export default fileUpload;