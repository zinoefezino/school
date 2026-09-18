import { Schema, models, model, Document, Types } from "mongoose";

export interface IPasswordResetToken extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  usedAt: Date,
});

export default models.PasswordResetToken ||
  model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema);
