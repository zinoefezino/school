import { Schema, models, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  invoice: Types.ObjectId;
  amount: number;
  paystackReference: string;
  paidAt: Date;
  channel?: "GATEWAY" | "BANK_TRANSFER" | "CASH" | "MANUAL";
  paymentMethod?: "BANK_TRANSFER" | "CASH" | "POS" | "CHEQUE" | "OTHER";
  depositorName?: string;
  notes?: string;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  recordedBy?: Types.ObjectId;
}

const paymentSchema = new Schema<IPayment>(
  {
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    amount: { type: Number, required: true, min: 0 },
    paystackReference: { type: String, required: true, unique: true },
    paidAt: { type: Date, default: Date.now },
    channel: {
      type: String,
      enum: ["GATEWAY", "BANK_TRANSFER", "CASH", "MANUAL"],
      default: "GATEWAY",
    },
    paymentMethod: {
      type: String,
      enum: ["BANK_TRANSFER", "CASH", "POS", "CHEQUE", "OTHER"],
    },
    depositorName: String,
    notes: String,
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "VERIFIED",
    },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

paymentSchema.index({ invoice: 1, paidAt: -1 });

export default models.Payment || model<IPayment>("Payment", paymentSchema);
