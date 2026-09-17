import { Schema, models, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  invoice: Types.ObjectId;
  amount: number;
  paystackReference: string;
  paidAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  invoice: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
  amount: { type: Number, required: true },
  paystackReference: { type: String, required: true, unique: true },
  paidAt: { type: Date, default: Date.now },
});

export default models.Payment || model<IPayment>("Payment", paymentSchema);
