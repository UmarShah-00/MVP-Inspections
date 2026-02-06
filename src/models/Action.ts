import mongoose, { Schema, models, model, Document } from "mongoose";

interface IAction extends Document {
  title: string;
  assignee: string;
  dueDate: Date;
  status: "Open" | "In Progress" | "Closed";
  evidence: string[];
  inspectionId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
}

const ActionSchema = new Schema<IAction>(
  {
    title: { type: String, required: true },
    assignee: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    evidence: [{ type: String }],
    inspectionId: {
      type: Schema.Types.ObjectId,
      ref: "Inspection",
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true },
);

const Action = models.Action || model<IAction>("Action", ActionSchema);

export default Action;
