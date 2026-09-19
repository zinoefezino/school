import { Schema, models, model, Document, Types } from "mongoose";

export interface IClassFee extends Document {
  classSection: Types.ObjectId;
  term: Types.ObjectId;
  amount: number;
  dueDate: Date;
  allowInstallments: boolean;
  minimumInstallmentAmount?: number;
  publishedAt?: Date;
}

const classFeeSchema = new Schema<IClassFee>(
  {
    classSection: {
      type: Schema.Types.ObjectId,
      ref: "ClassSection",
      required: true,
    },
    term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    allowInstallments: { type: Boolean, default: false },
    minimumInstallmentAmount: { type: Number, min: 0 },
    publishedAt: Date,
  },
  { timestamps: true },
);

classFeeSchema.index({ classSection: 1, term: 1 }, { unique: true });

export default models.ClassFee || model<IClassFee>("ClassFee", classFeeSchema);
