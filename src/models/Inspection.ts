import mongoose, { Schema, models, model, Document } from "mongoose";

interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  answer: "Yes" | "No" | "N/A";
  actionId?: mongoose.Types.ObjectId;
}

export interface IInspection extends Document {
  title: string;
  date: Date;
  categoryId: mongoose.Types.ObjectId;
  subcontractorId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status: "Draft" | "Submitted";
  description?: string;
  answers: IAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answer: { type: String, enum: ["Yes", "No", "N/A"], required: true },
    actionId: { type: Schema.Types.ObjectId, ref: "Action" },
  },
  { _id: false },
);

const InspectionSchema = new Schema<IInspection>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcontractorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Draft", "Submitted"], default: "Draft" },
    description: { type: String, trim: true },
    answers: [AnswerSchema],
  },
  { timestamps: true },
);

const Inspection =
  models.Inspection || model<IInspection>("Inspection", InspectionSchema);

export default Inspection;
