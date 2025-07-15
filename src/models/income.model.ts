import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true }, // מספר קבלה
  date: { type: Date, required: true }, // תאריך
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false }, // לקוח (קישור למודל לקוחות)
  amount: { type: Number, required: true }, // סכום
  vat: { type: Number, required: true }, // מע"מ
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit', 'Check', 'Bank Transfer'],
    required: true
  }, // אופן התשלום

  paymentDetails: {
    last4Digits: { type: String },        // לאשראי
    installments: { type: Number },       // לאשראי
    checkNumber: { type: String },        // לצ'ק
    bankAccountNumber: { type: String },  // לצ'ק/העברה
    bankCode: { type: String },           // לצ'ק/העברה
    dueDate: { type: Date }               // לצ'ק/העברה
  },

  details: { type: String },    // פרטים חופשיים
  printDate: { type: Date },    // תאריך הדפסת קבלה
  document: { type: String }    // קובץ קבלה (PDF או תמונה)
});

export default mongoose.model('Income', incomeSchema);
