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

export default models.Staff || model<IStaff>("Staff", staffSchema);
