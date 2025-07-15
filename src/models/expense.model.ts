import mongoose, { Document, Schema } from 'mongoose';

interface PaymentDetails {
  last4Digits?: string;         // אשראי
  installments?: number;        // אשראי
  checkNumber?: string;         // צ'ק
  bankAccountNumber?: string;   // צ'ק/העברה
  bankCode?: string;            // צ'ק/העברה
  dueDate?: Date;               // צ'ק/העברה
}

export interface IExpense extends Document {
  referenceNumber: string;
  date: Date;
  supplier: mongoose.Types.ObjectId;
  category: 'Salary' | 'Furniture' | 'Cleaning' | 'Petty Cash' | 'Maintenance';
  amount: number;
  vat: number;
  paymentMethod: 'Cash' | 'Credit' | 'Check' | 'Bank Transfer';
  paymentDetails?: PaymentDetails;
  document?: string; // הקובץ המצורף (PDF או קובץ אחר)
}

const expenseSchema = new Schema<IExpense>({
  referenceNumber: { type: String, required: true },
  date: { type: Date, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  category: {
    type: String,
    enum: ['Salary', 'Furniture', 'Cleaning', 'Petty Cash', 'Maintenance'],
    required: true
  },
  amount: { type: Number, required: true },
  vat: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit', 'Check', 'Bank Transfer'],
    required: true
  },
  paymentDetails: {
    last4Digits: { type: String },
    installments: { type: Number },
    checkNumber: { type: String },
    bankAccountNumber: { type: String },
    bankCode: { type: String },
    dueDate: { type: Date }
  },
  document: { type: String } // הקובץ המצורף
});

export default mongoose.model<IExpense>('Expense', expenseSchema);
