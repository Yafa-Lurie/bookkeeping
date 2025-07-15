
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
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';
import Income from '../models/income.model';
import mongoose from 'mongoose';

class IncomeController {
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
        printDate,
        paymentDetails = {} // נקבל את כל פרטי התשלום כ-Object
      } = req.body;

      // נבנה את פרטי התשלום לפי סוג התשלום
      let filteredPaymentDetails: any = {};

      switch (paymentMethod) {
        case 'Credit':
          filteredPaymentDetails = {
            last4Digits: paymentDetails.last4Digits,
            installments: paymentDetails.installments
          };
          break;

        case 'Check':
        case 'Bank Transfer': // לשניהם אותו מבנה
          filteredPaymentDetails = {
            checkNumber: paymentDetails.checkNumber,
            bankAccountNumber: paymentDetails.bankAccountNumber,
            bankCode: paymentDetails.bankCode,
            dueDate: paymentDetails.dueDate
          };
          break;

        case 'Cash':
          filteredPaymentDetails = {}; // לא צריך מידע נוסף
          break;

        default:
          res.status(400).json({ message: 'Invalid payment method' });
          return;

      }

      const income = new Income({
        receiptNumber,
        date,
        client,
        amount,
        vat,
        paymentMethod,
        paymentDetails: filteredPaymentDetails,
        details,
        printDate,
        document: req.file?.path // אם את משתמשת ב-multer
      });

      await income.save();

      // צור את הקובץ PDF ושמור אותו בתיקייה
      const receiptsDir = path.join(__dirname, '../../receipts');
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir);
      }

      const pdfPath = path.join(receiptsDir, `receipt_${income._id}.pdf`);
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));

      // תוכן הקבלה:
      doc.fontSize(18).text('Receipt', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Receipt Number: ${receiptNumber}`);
      doc.text(`Date: ${new Date(date).toLocaleDateString()}`);
      doc.text(`Client ID: ${client}`);
      doc.text(`Amount: ${amount}`);
      doc.text(`VAT: ${vat}`);
      doc.text(`Payment Method: ${paymentMethod}`);
      doc.text(`Details: ${details || ''}`);
      doc.end();

      // עדכן את ההכנסה עם הנתיב של הקובץ
      income.document = pdfPath;
      await income.save();

      res.status(201).json(income);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

static async downloadReceipt(req: Request, res: Response): Promise<void> {
  try {
    const income = await Income.findById(req.params.id);
    if (!income || !income.document) {
      res.status(404).send('Receipt not found');
      return;
    }

    res.download(income.document); // שולח את הקובץ להורדה
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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