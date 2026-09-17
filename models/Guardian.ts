import { Schema, models, model, Document, Types } from "mongoose";

export interface IGuardian extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone?: string;
}

const guardianSchema = new Schema<IGuardian>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullName: { type: String, required: true },
  phone: String,
});

export default models.Guardian || model<IGuardian>("Guardian", guardianSchema);
