// backend: app/api/inspections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Action from "@/models/Action";
import Question from "@/models/Question";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

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

    if (!inspection.categoryId) {
      return NextResponse.json(
        {
          inspection,
          questions: [],
          actions: [],
          warning: "Category missing or deleted for this inspection",
        },
        { status: 200 },
      );
    }

    const questions = await Question.find({
      categoryId: inspection.categoryId,
    }).lean();

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

    // --- Update status dynamically ---
    const status = body.get("status") as string | undefined;
    if (status && (status === "Draft" || status === "Submitted")) {
      inspection.status = status;
    } else {
      inspection.status = "Submitted";
    }

    // Define Answer type for TypeScript
    type Answer = {
      questionId: string | mongoose.Types.ObjectId;
      answer: string;
      actionId?: mongoose.Types.ObjectId;
    };

    answers.forEach((a) => {
      const existing = inspection.answers.find(
        (ans: Answer) => ans.questionId.toString() === a.questionId,
      );
      if (existing) {
        existing.answer = a.answer;
      } else {
        inspection.answers.push({ questionId: a.questionId, answer: a.answer });
      }
    });

    // --- 4️⃣ Parse newActions safely ---
    const newActionsRaw = body.get("newActions") as string | null;
    const newActions = newActionsRaw ? JSON.parse(newActionsRaw) : [];
    const savedActions: any[] = [];

    for (const a of newActions) {
      const files: string[] = [];

      // Upload all files for this action to Cloudinary
      for (const [key, value] of body.entries()) {
        if (key === a.questionId && value instanceof File) {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "inspections" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              },
            );
            stream.end(buffer);
          });

          files.push(uploadResult.secure_url);
        }
      }

      // Create Action once per newAction
      const action = await Action.create({
        title: a.title,
        assignee: new mongoose.Types.ObjectId(a.assignee),
        dueDate: a.dueDate,
        status: a.status || "Open",
        evidence: files,
        inspectionId,
        questionId: a.questionId,
      });

      savedActions.push(action);

      const answer = inspection.answers.find(
        (ans: Answer) => ans.questionId.toString() === a.questionId.toString(),
      );
      if (answer) answer.actionId = action._id;
    }

    // --- 5️⃣ Save inspection ---
    await inspection.save();

    return NextResponse.json(
      {
        message: "Inspection submitted successfully",
        inspection,
        savedActions,
      },
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
