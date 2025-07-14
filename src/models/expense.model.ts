import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  referenceNumber: string;
  date: Date;
  supplier: mongoose.Types.ObjectId;
  category: 'Salary' | 'Furniture' | 'Cleaning' | 'Petty Cash' | 'Maintenance';
  amount: number;
  vat: number;
  paymentMethod: 'Cash' | 'Credit' | 'Bank Transfer';
  document?: string;
}

const expenseSchema = new Schema<IExpense>({
  referenceNumber: { type: String, required: true },
  date: { type: Date, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  category: { type: String, enum: ['Salary', 'Furniture', 'Cleaning', 'Petty Cash', 'Maintenance'], required: true },
  amount: { type: Number, required: true },
  vat: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Bank Transfer'], required: true },
  document: { type: String }
});

export default mongoose.model<IExpense>('Expense', expenseSchema);
