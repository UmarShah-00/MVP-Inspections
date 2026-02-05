import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICategory extends Document {
  code: string;
  name: string;
  description?: string;
}

const CategorySchema = new Schema<ICategory>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
});

export default models.Category || model<ICategory>("Category", CategorySchema);
