import multer from "multer";

const storage = multer.memoryStorage();
const fileUpload = multer({ storage });

export default fileUpload;
