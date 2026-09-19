import { Schema, models, model, Document, Types } from "mongoose";

export type TimetableDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ITimetableEntry extends Document {
  classSection: Types.ObjectId;
  term?: Types.ObjectId;
  subject: Types.ObjectId;
  teacher?: Types.ObjectId;
  day: TimetableDay;
  startTime: string;
  endTime: string;
  room?: string;
}

const timetableEntrySchema = new Schema<ITimetableEntry>({
  classSection: {
    type: Schema.Types.ObjectId,
    ref: "ClassSection",
    required: true,
  },
  term: { type: Schema.Types.ObjectId, ref: "Term" },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Staff" },
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: String,
});

timetableEntrySchema.index({ classSection: 1, term: 1, day: 1, startTime: 1 });

export default models.TimetableEntry ||
  model<ITimetableEntry>("TimetableEntry", timetableEntrySchema);
