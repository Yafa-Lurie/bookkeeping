import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';

const router = Router();

// הכנסות מול הוצאות לפי טווח תאריכים
router.get('/income-vs-expense', ReportController.incomeVsExpense);

// הכנסות לפי לקוח
router.get('/income-by-client/:clientId', ReportController.incomeByClient);

// הכנסות לפי שיטת תשלום
router.get('/income-by-payment-method', ReportController.incomeByPaymentMethod);

// הכנסות לפי טווח תאריכים
router.get('/income-by-date', ReportController.incomeByDate);

// הוצאות לפי קטגוריה
router.get('/expenses-by-category', ReportController.expensesByCategory);

// הוצאות לפי אופן תשלום
router.get('/expenses-by-payment-method', ReportController.expensesByPaymentMethod);

// הוצאות לפי טווח תאריכים
router.get('/expenses-by-date', ReportController.expensesByDate);

export default router;
