
import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true },
  date: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client',required:false },
  amount: { type: Number, required: true },
  vat: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Check', 'Bank Transfer'], required: true },
  details: { type: String },
  printDate: { type: Date },
  document: { type: String } // Field for the uploaded PDF file path
});

export default mongoose.model('Income', incomeSchema);