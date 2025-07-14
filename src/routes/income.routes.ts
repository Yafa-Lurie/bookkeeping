// import express from 'express';
// import IncomeController from '../controllers/income.controller';

// const router = express.Router();

// // Define routes for income
// router.post('/', IncomeController.createIncome);
// router.get('/', IncomeController.getAllIncomes);
// router.get('/:id', IncomeController.getIncomeById);
// router.put('/:id', IncomeController.updateIncome);
// router.delete('/:id', IncomeController.deleteIncome);

// export default router;
import express from 'express';
import multer from 'multer'; // Import multer
import IncomeController from '../controllers/income.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set your desired storage path for uploaded files

// Define routes for income
router.post('/', upload.single('document'), IncomeController.createIncome); // Handles file uploads
router.get('/', IncomeController.getAllIncomes);
router.get('/:id', IncomeController.getIncomeById);
router.put('/:id', upload.single('document'), IncomeController.updateIncome); // Handles file uploads
router.delete('/:id', IncomeController.deleteIncome);

export default router;