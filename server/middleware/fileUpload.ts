import multer from "multer";

const storage = multer.memoryStorage();
const fileUpload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type, only images are allowed!"));
		}
	},
});

export default fileUpload;
