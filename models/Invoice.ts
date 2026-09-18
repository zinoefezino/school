import { Schema, models, model, Document, Types } from "mongoose";

export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE";

export interface IInvoice extends Document {
  student: Types.ObjectId;
  term: Types.ObjectId;
  amount: number;
  dueDate: Date;
  status: InvoiceStatus;
  classSection: Types.ObjectId;
}

const invoiceSchema = new Schema<IInvoice>({
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
});

export default models.Invoice || model<IInvoice>("Invoice", invoiceSchema);
