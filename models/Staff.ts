import { Schema, models, model, Document, Types } from "mongoose";

export interface IStaff extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone?: string;
  department?: string;
  subjects: Types.ObjectId[];
}

const staffSchema = new Schema<IStaff>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullName: { type: String, required: true },
  phone: String,
  department: String,
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
});

staffSchema.index({ fullName: 1 });
staffSchema.index({ department: 1 });
staffSchema.index({ phone: 1 });

export default models.Staff || model<IStaff>("Staff", staffSchema);
