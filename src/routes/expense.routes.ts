import express from 'express';
import ExpenseController from '../controllers/expense.controller';

const router = express.Router();

// Define routes for expenses
router.post('/', ExpenseController.createExpense);
router.get('/', ExpenseController.getAllExpenses);
router.get('/:id', ExpenseController.getExpenseById);
router.put('/:id', ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);

export default router;


