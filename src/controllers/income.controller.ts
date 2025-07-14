
// import { Request, Response } from 'express';
// import Income from '../models/income.model'; // Make sure to create this model

// class IncomeController {
//   static async createIncome(req: Request, res: Response): Promise<void> {
//     try {
//       const income = new Income(req.body);
//       await income.save();
//       res.status(201).json(income);
//     } catch (error:any) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   static async getAllIncomes(req: Request, res: Response): Promise<void> {
//     try {
//       const incomes = await Income.find();
//       res.status(200).json(incomes);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   static async getIncomeById(req: Request, res: Response): Promise<void> {
//     try {
//       const income = await Income.findById(req.params.id);
//       if (!income) {
//          res.status(404).send('Income not found');
//          return;
//       }
//       res.status(200).json(income);
//     } catch (error: any) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   static async updateIncome(req: Request, res: Response): Promise<void> {
//     try {
//       const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       if (!income) {
//         res.status(404).send('Income not found');
//         return;
//       }
//       res.status(200).json(income);
//     } catch (error:any) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   static async deleteIncome(req: Request, res: Response): Promise<void> {
//     try {
//       const income = await Income.findByIdAndDelete(req.params.id);
//       if (!income) {
//         res.status(404).send('Income not found');
//         return;
//       }
//       res.status(204).send();
//     } catch (error:any) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// }

// export default IncomeController;

import { Request, Response } from 'express';
import Income from '../models/income.model';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

class IncomeController {


  static async downloadDocument(req: Request, res: Response): Promise<void> {
    try {
      const income = await Income.findById(req.params.id);
      console.log(income);
      if (!income || !income.document) {
        res.status(404).send('Document not found');
        return;
      }
      const filePath = path.resolve(income.document);
      // Ensure correct path resolution
      console.log(filePath);
      if (!fs.existsSync(filePath)) {
        res.status(404).send('File does not exist');
      }
      res.download(filePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error downloading the file');
        }
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async createIncome(req: Request, res: Response): Promise<void> {
    try {
      const {
        receiptNumber,
        date,
        client,
        amount,
        vat,
        paymentMethod,
        details,
        printDate
      } = req.body;

      const incomeData = {
        receiptNumber,
        date: new Date(date),
        client: new mongoose.Types.ObjectId(client),
        amount: parseFloat(amount),
        vat: parseFloat(vat),
        paymentMethod,
        details,
        printDate: printDate ? new Date(printDate) : undefined,
        document: req.file?.path
      };

      const income = new Income(incomeData);
      await income.save();
      res.status(201).json(income);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }



  static async getAllIncomes(req: Request, res: Response): Promise<void> {
    try {
      const incomes = await Income.find();
      res.status(200).json(incomes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getIncomeById(req: Request, res: Response): Promise<void> {
    try {
      const income = await Income.findById(req.params.id);
      if (!income) {
        res.status(404).send('Income not found');
        return;
      }
      res.status(200).json(income);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateIncome(req: Request, res: Response): Promise<void> {
    try {
      const incomeData: any = {
        ...req.body,
        ...(req.file && { document: req.file.path }) // Update with new document path if uploaded
      };
      const income = await Income.findByIdAndUpdate(req.params.id, incomeData, { new: true });
      if (!income) {
        res.status(404).send('Income not found');
        return;
      }
      res.status(200).json(income);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteIncome(req: Request, res: Response): Promise<void> {
    try {
      const income = await Income.findByIdAndDelete(req.params.id);
      if (!income) {
        res.status(404).send('Income not found');
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default IncomeController;