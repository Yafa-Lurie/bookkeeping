import express from 'express';
import IncomeController from '../controllers/income.controller';

const router = express.Router();

// Define routes for income
router.post('/', IncomeController.createIncome);
router.get('/', IncomeController.getAllIncomes);
router.get('/:id', IncomeController.getIncomeById);
router.put('/:id', IncomeController.updateIncome);
router.delete('/:id', IncomeController.deleteIncome);

export default router;
