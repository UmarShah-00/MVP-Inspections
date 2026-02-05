import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import Question from "@/models/Question";

export async function GET() {
  try {
    await connectMongo();
    const questions = await Question.find()
      .populate("categoryId", "name")
      .lean();
    return NextResponse.json({ questions });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { categoryId, text } = body;

    if (!categoryId || !text) {
      return NextResponse.json(
        { message: "Category and text are required" },
        { status: 400 },
      );
    }

    await connectMongo();
    const question = await Question.create({ categoryId, text });

    return NextResponse.json(
      { message: "Question created successfully", question },
      { status: 201 },
    );
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
    await connectMongo();
    const updated = await Question.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    return NextResponse.json({
      message: "Question updated",
      question: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongo();
    await Question.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Question deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
