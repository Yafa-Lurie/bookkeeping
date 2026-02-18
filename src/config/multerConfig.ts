import multer from 'multer';
import path from 'path';

// Configure storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save the files
    },
    filename: (req, file, cb) => {
        // Set the filename to include the original name and timestamp
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Create the multer instance
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only PDF files
        const ext = path.extname(file.originalname);
        if (ext !== '.pdf') {
            return cb(new Error('Only PDF files are allowed.'));
        }
        cb(null, true);
    }
});
// Export the upload middleware
export default upload;