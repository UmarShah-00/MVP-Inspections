// backend: app/api/inspections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Action from "@/models/Action";
import Question from "@/models/Question";
import fs from "fs";
import path from "path";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const inspection = await Inspection.findById(params.id)
      .populate("subcontractorId", "name role")
      .populate("createdBy", "name role")
      .populate("categoryId", "name")
      .lean();

    if (!inspection)
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 },
      );

    // Fetch only questions for this inspection's category
    const questions = await Question.find({
      categoryId: inspection.categoryId._id,
    }).lean();

    // Fetch actions for this inspection
    const actions = await Action.find({ inspectionId: inspection._id }).lean();

    return NextResponse.json(
      { inspection, questions, actions },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("GET Inspection Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch inspection detail" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const inspectionId = params.id;

  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content-Type must be multipart/form-data" },
      { status: 400 },
    );
  }

  try {
    const body = await req.formData();

    // --- 1️⃣ Parse answers safely ---
    const answersRaw = body.get("answers") as string | null;
    const answers: { questionId: string; answer: string }[] = answersRaw
      ? JSON.parse(answersRaw)
      : [];

    const inspection = await Inspection.findById(inspectionId);
    if (!inspection)
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 },
      );

    answers.forEach((a) => {
      const existing = inspection.answers.find(
        (ans) => ans.questionId.toString() === a.questionId,
      );
      if (existing) {
        existing.answer = a.answer;
      } else {
        inspection.answers.push({ questionId: a.questionId, answer: a.answer });
      }
    });

    // --- 2️⃣ Parse newActions safely ---
    const newActionsRaw = body.get("newActions") as string | null;
    const newActions = newActionsRaw ? JSON.parse(newActionsRaw) : [];
    const savedActions: any[] = [];

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    for (const a of newActions) {
      const files: string[] = [];

      for (const [key, value] of body.entries()) {
        if (key === a.questionId && value instanceof File) {
          const fileName = `${Date.now()}-${value.name}`;
          const filePath = path.join(uploadDir, fileName);
          const arrayBuffer = await value.arrayBuffer();
          fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
          files.push(`/uploads/${fileName}`);
        }
      }

      const action = await Action.create({
        title: a.title,
        assignee: a.assignee,
        dueDate: a.dueDate,
        status: a.status || "Open",
        evidence: files,
        inspectionId,
        questionId: a.questionId,
      });

      savedActions.push(action);

      // Link action to inspection answer
      const answer = inspection.answers.find(
        (ans) => ans.questionId.toString() === a.questionId.toString(),
      );
      if (answer) answer.actionId = action._id;
    }

    await inspection.save();

    return NextResponse.json(
      { message: "Inspection and actions saved", inspection, savedActions },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("PATCH Inspection Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save inspection" },
      { status: 500 },
    );
  }
}

