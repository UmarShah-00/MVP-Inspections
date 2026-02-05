import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
