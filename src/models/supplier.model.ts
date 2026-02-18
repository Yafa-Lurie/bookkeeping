import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

const supplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String }
});

export default mongoose.model<ISupplier>('Supplier', supplierSchema);
