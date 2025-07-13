//  import mongoose, { Document, Schema } from 'mongoose';

//  export interface IIncome extends Document {
//    receiptNumber: string;
//    date: Date;
//    client: string; // You can reference a client model here
//    amount: number;
//    vat: number;
//    paymentMethod: string; // e.g., cash, credit card, check
//    details: string;
//    receiptPrintDate: Date;
//  }

//  const IncomeSchema: Schema = new Schema({
//    receiptNumber: { type: String, required: true },
//    date: { type: Date, required: true },
//    client: { type: String, required: true },
//    amount: { type: Number, required: true },
//    vat: { type: Number, required: true },
//    paymentMethod: { type: String, required: true },
//    details: { type: String },
//    receiptPrintDate: { type: Date }
//  });

//  export default mongoose.model<IIncome>('Income', IncomeSchema);

import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({

  receiptNumber: { type: String, required: true },

  date: { type: Date, required: true },

  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },

  amount: { type: Number, required: true },

  vat: { type: Number, required: true },

  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Check', 'Bank Transfer'], required: true },

  details: { type: String },

  printDate: { type: Date },

});
export default mongoose.model('Income', incomeSchema);