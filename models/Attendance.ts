import { Schema, models, model, Document, Types } from "mongoose";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface IAttendance extends Document {
  student: Types.ObjectId;
  term: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
}

const attendanceSchema = new Schema<IAttendance>({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  term: { type: Schema.Types.ObjectId, ref: "Term", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], required: true },
});

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

export default models.Attendance ||
  model<IAttendance>("Attendance", attendanceSchema);
