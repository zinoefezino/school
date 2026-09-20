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

guardianSchema.index({ fullName: 1 });
guardianSchema.index({ phone: 1 });

export default models.Guardian || model<IGuardian>("Guardian", guardianSchema);
