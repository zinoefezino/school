import { Schema, models, model, Document, Types } from "mongoose";

export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE";

export interface IInvoice extends Document {
  student: Types.ObjectId;
  term: Types.ObjectId;
  amount: number;
  dueDate: Date;
  status: InvoiceStatus;
  classSection: Types.ObjectId;
  allowInstallments: boolean;
  minimumInstallmentAmount?: number;
  classFee?: Types.ObjectId;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "OVERDUE"],
      default: "PENDING",
    },
    classSection: {
      type: Schema.Types.ObjectId,
      ref: "ClassSection",
      required: true,
    },
    allowInstallments: { type: Boolean, default: false },
    minimumInstallmentAmount: { type: Number, min: 0 },
    classFee: { type: Schema.Types.ObjectId, ref: "ClassFee" },
  },
  { timestamps: true },
);

invoiceSchema.index({ student: 1 });
invoiceSchema.index({ student: 1, term: 1 }, { unique: true });
invoiceSchema.index({ classSection: 1, term: 1 });
invoiceSchema.index({ status: 1, dueDate: 1 });

export default models.Invoice || model<IInvoice>("Invoice", invoiceSchema);
