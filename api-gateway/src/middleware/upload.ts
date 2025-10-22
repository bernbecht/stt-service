import multer from "multer";

// configure multer to store files in memory
const storage = multer.memoryStorage();
// Create the multer instance that will handle a single file upload with the field name 'audio'
const upload = multer({ storage });

export default upload;