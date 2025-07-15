
// class ExpenseController {
//   static async createExpense(req: Request, res: Response): Promise<void> {
//     try {
//       const expense = new Expense(req.body);
//       await expense.save();
//       res.status(201).json(expense);
//     } catch (error:any) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   static async getAllExpenses(req: Request, res: Response): Promise<void> {
//     try {
//       const expenses = await Expense.find();
//       res.status(200).json(expenses);
//     } catch (error:any) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   static async getExpenseById(req: Request, res: Response): Promise<void> {
//     try {
//       const expense = await Expense.findById(req.params.id);
//       if (!expense) {
//         res.status(404).send('Expense not found');
//         return;
//       }
//       res.status(200).json(expense);
//     } catch (error:any) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   static async updateExpense(req: Request, res: Response): Promise<void> {
//     try {
//       const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       if (!expense) {
//         res.status(404).send('Expense not found');
//         return;
//       }
//       res.status(200).json(expense);
//     } catch (error:any) {
//       res.status(400).json({ message: error.message });
//     }
//   }

//   static async deleteExpense(req: Request, res: Response): Promise<void> {
//     try {
//       const expense = await Expense.findByIdAndDelete(req.params.id);
//       if (!expense) {
//         res.status(404).send('Expense not found');
//         return;
//       }
//       res.status(204).send();
//     } catch (error:any) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// }

// export default ExpenseController;
import { Request, Response } from 'express';
import Expense from '../models/expense.model'; // Make sure to create this model
import mongoose from 'mongoose';
import Income from '../models/income.model';

class ExpenseController {
 

  // static async createExpense(req: Request, res: Response): Promise<void> {
  //   try {
  //     const expenseData = {
  //       referenceNumber: req.body.referenceNumber,
  //       date: new Date(req.body.date),
  //       supplier: req.body.supplier,
  //       category: req.body.category,
  //       amount: req.body.amount,
  //       vat: req.body.vat,
  //       paymentMethod: req.body.paymentMethod,
  //       document: req.file?.path // Assuming you are using a file upload middleware like multer
  //     };

  //     const expense = new Expense(expenseData);
  //     await expense.save();
  //     res.status(201).json(expense);
  //   } catch (error: any) {
  //     res.status(400).json({ message: error.message });
  //   }
  // }import { Request, Response } from 'express';

  static async createExpense(req: Request, res: Response): Promise<void> {
    try {
      const {
        referenceNumber,
        date,
        supplier,
        category,
        amount,
        vat,
        paymentMethod,
        last4Digits,
        installments,
        checkNumber,
        bankAccountNumber,
        bankCode,
        dueDate
      } = req.body;

      // יצירת אובייקט פרטי תשלום בהתאם לאופן התשלום
      let paymentDetails: any = {};

      switch (paymentMethod) {
        case 'Credit':
          paymentDetails = {
            last4Digits,
            installments
          };
          break;
        case 'Check':
        case 'Bank Transfer':
          paymentDetails = {
            checkNumber,
            bankAccountNumber,
            bankCode,
            dueDate
          };
          break;
        case 'Cash':
          paymentDetails = {}; // אין פרטים נוספים
          break;
        default:
           res.status(400).json({ message: 'Invalid payment method' });
           return;
      }

      const expense = new Expense({
        referenceNumber,
        date: new Date(date),
        supplier,
        category,
        amount: parseFloat(amount),
        vat: parseFloat(vat),
        paymentMethod,
        paymentDetails,
        document: req.file?.path // אם עלה קובץ אסמכתא
      });

      await expense.save();
      res.status(201).json(expense);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }



  static async getAllExpenses(req: Request, res: Response): Promise<void> {
    try {
      const expenses = await Expense.find();
      res.status(200).json(expenses);
    } catch (error: any) {
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateExpense(req: Request, res: Response): Promise<void> {
    try {
      const expenseData = {
        ...req.body,
        ...(req.file && { document: req.file.path }) // Update the document path if a new file is uploaded
      };

      const expense = await Expense.findByIdAndUpdate(req.params.id, expenseData, { new: true });
      if (!expense) {
        res.status(404).send('Expense not found');
        return;
      }
      res.status(200).json(expense);
    } catch (error: any) {
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ExpenseController;