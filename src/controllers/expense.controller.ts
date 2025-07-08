import { Request, Response } from 'express';
import Expense from '../models/expense.model'; // Make sure to create this model

class ExpenseController {
  static async createExpense(req: Request, res: Response): Promise<void> {
    try {
      const expense = new Expense(req.body);
      await expense.save();
      res.status(201).json(expense);
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllExpenses(req: Request, res: Response): Promise<void> {
    try {
      const expenses = await Expense.find();
      res.status(200).json(expenses);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getExpenseById(req: Request, res: Response): Promise<void> {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        res.status(404).send('Expense not found');
        return;
      }
      res.status(200).json(expense);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateExpense(req: Request, res: Response): Promise<void> {
    try {
      const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!expense) {
        res.status(404).send('Expense not found');
        return;
      }
      res.status(200).json(expense);
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteExpense(req: Request, res: Response): Promise<void> {
    try {
      const expense = await Expense.findByIdAndDelete(req.params.id);
      if (!expense) {
        res.status(404).send('Expense not found');
        return;
      }
      res.status(204).send();
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ExpenseController;
