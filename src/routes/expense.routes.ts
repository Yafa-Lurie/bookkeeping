// import express from 'express';
// import ExpenseController from '../controllers/expense.controller';

// const router = express.Router();

// // Define routes for expenses
// router.post('/', ExpenseController.createExpense);
// router.get('/', ExpenseController.getAllExpenses);
// router.get('/:id', ExpenseController.getExpenseById);
// router.put('/:id', ExpenseController.updateExpense);
// router.delete('/:id', ExpenseController.deleteExpense);

// export default router;


import express from 'express';
import multer from 'multer';
import ExpenseController from '../controllers/expense.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set your desired storage path

// Define routes for expenses
router.post('/', upload.single('document'), ExpenseController.createExpense); // Handles file uploads
router.get('/', ExpenseController.getAllExpenses);
router.get('/:id', ExpenseController.getExpenseById);
router.put('/:id', upload.single('document'), ExpenseController.updateExpense); // Handles file uploads
router.delete('/:id', ExpenseController.deleteExpense);

export default router;