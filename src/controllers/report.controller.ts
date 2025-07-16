import { Request, Response } from 'express';
import Income from '../models/income.model';
import Expense from '../models/expense.model';

export class ReportController {
  static async incomeVsExpense(req: Request, res: Response) {
    try {
      const { from, to } = req.query;

      const income = await Income.find({
        date: { $gte: new Date(from as string), $lte: new Date(to as string) }
      });

      const expenses = await Expense.find({
        date: { $gte: new Date(from as string), $lte: new Date(to as string) }
      });

      const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

      res.json({ totalIncome, totalExpense });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

    // הכנסות לפי לקוח
  static async incomeByClient(req: Request, res: Response) {
    try {
      const { clientId } = req.params;

      const incomes = await Income.find({ client: clientId });
      const total = incomes.reduce((sum, item) => sum + item.amount, 0);

      res.json({ total, incomes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // הכנסות לפי שיטת תשלום
  static async incomeByPaymentMethod(req: Request, res: Response) {
    try {
      const grouped = await Income.aggregate([
        {
          $group: {
            _id: '$paymentMethod',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);

      res.json(grouped);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // הכנסות לפי טווח תאריכים
  static async incomeByDate(req: Request, res: Response) {
    try {
      const { from, to } = req.query;

      const incomes = await Income.find({
        date: { $gte: new Date(from as string), $lte: new Date(to as string) }
      });

      const total = incomes.reduce((sum, item) => sum + item.amount, 0);

      res.json({ total, incomes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // הוצאות לפי קטגוריה
  static async expensesByCategory(req: Request, res: Response) {
    try {
      const grouped = await Expense.aggregate([
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);

      res.json(grouped);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // הוצאות לפי אופן תשלום
  static async expensesByPaymentMethod(req: Request, res: Response) {
    try {
      const grouped = await Expense.aggregate([
        {
          $group: {
            _id: '$paymentMethod',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);

      res.json(grouped);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // הוצאות לפי טווח תאריכים
  static async expensesByDate(req: Request, res: Response) {
    try {
      const { from, to } = req.query;

      const expenses = await Expense.find({
        date: { $gte: new Date(from as string), $lte: new Date(to as string) }
      });

      const total = expenses.reduce((sum, item) => sum + item.amount, 0);

      res.json({ total, expenses });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

}
