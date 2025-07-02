   import mongoose, { Document, Schema } from 'mongoose';

   export interface IExpense extends Document {
     referenceNumber: string;
     date: Date;
     supplier: string; // You can reference a supplier model here
     category: string; // e.g., salary, furniture
     amount: number;
     vat: number;
     paymentMethod: string; // e.g., cash, credit
     reference: string;
   }

   const ExpenseSchema: Schema = new Schema({
     referenceNumber: { type: String, required: true },
     date: { type: Date, required: true },
     supplier: { type: String, required: true },
     category: { type: String, required: true },
     amount: { type: Number, required: true },
     vat: { type: Number, required: true },
     paymentMethod: { type: String, required: true },
     reference: { type: String }
   });

   export default mongoose.model<IExpense>('Expense', ExpenseSchema);
