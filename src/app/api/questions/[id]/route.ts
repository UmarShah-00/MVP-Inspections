import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Question from "@/models/Question";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const question = await Question.findById(params.id)
      .populate("categoryId", "name")
      .lean();
    if (!question)
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    return NextResponse.json({ question });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const { categoryId, text } = body;

    if (!categoryId || !text) {
      return NextResponse.json(
        { error: "Category and text are required" },
        { status: 400 },
      );
    }

     await connectDB();
    const updated = await Question.findByIdAndUpdate(
      params.id,
      { categoryId, text },
      { new: true },
    );

    return NextResponse.json({
      message: "Question updated successfully",
      question: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();

    const deleted = await Question.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}