
import { Request, Response } from 'express';
import Income from '../models/income.model'; // Make sure to create this model

class IncomeController {
  static async createIncome(req: Request, res: Response) {
    try {
      const income = new Income(req.body);
      await income.save();
      res.status(201).json(income);
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllIncomes(req: Request, res: Response) {
    try {
      const incomes = await Income.find();
      res.status(200).json(incomes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getIncomeById(req: Request, res: Response) {
    try {
      const income = await Income.findById(req.params.id);
      if (!income) return res.status(404).send('Income not found');
      res.status(200).json(income);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateIncome(req: Request, res: Response) {
    try {
      const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!income) return res.status(404).send('Income not found');
      res.status(200).json(income);
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteIncome(req: Request, res: Response) {
    try {
      const income = await Income.findByIdAndDelete(req.params.id);
      if (!income) return res.status(404).send('Income not found');
      res.status(204).send();
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default IncomeController;

