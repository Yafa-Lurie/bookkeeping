
import express from 'express';
import multer from 'multer'; // Import multer
import IncomeController from '../controllers/income.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set your desired storage path for uploaded files
router.get('/download-document/:id', IncomeController.downloadDocument);
router.post('/', upload.single('document'), IncomeController.createIncome); // Handles file uploads
router.get('/', IncomeController.getAllIncomes);
router.get('/:id', IncomeController.getIncomeById);
router.put('/:id', upload.single('document'), IncomeController.updateIncome); // Handles file uploads
router.delete('/:id', IncomeController.deleteIncome);

export default router;