//  import mongoose, { Document, Schema } from 'mongoose';

//  export interface IExpense extends Document {
//    referenceNumber?: string;
//    date: Date;
//    supplier?: string; // You can reference a supplier model here
//    category: string; // e.g., salary, furniture
//    amount: number;
//    vat?: number;
//    paymentMethod?: string; // e.g., cash, credit
//    reference?: string;
//    description?: string;
//  }

//  const ExpenseSchema: Schema = new Schema({
//    referenceNumber: { type: String, required: false },
//    date: { type: Date, required: true },
//    supplier: { type: String, required: false },
//    category: { type: String, required: true },
//    amount: { type: Number, required: true },
//    vat: { type: Number, required: false },
//    paymentMethod: { type: String, required: false },
//    reference: { type: String, required: false },
//    description: { type: String, required: false }
//  });

//  export default mongoose.model<IExpense>('Expense', ExpenseSchema);
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({

  referenceNumber: { type: String, required: true },

  date: { type: Date, required: true },

  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },

  category: { type: String, enum: ['Salary', 'Furniture', 'Cleaning', 'Petty Cash', 'Maintenance'], required: true },

  amount: { type: Number, required: true },

  vat: { type: Number, required: true },

  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Bank Transfer'], required: true },

  document: { type: String }, // File path for the uploaded document

});


export default mongoose.model('Expense', expenseSchema);