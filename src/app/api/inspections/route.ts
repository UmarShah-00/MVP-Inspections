import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import User from "@/models/User";
import { verifyToken, type DecodedToken } from "@/lib/jwt";
import Category from "@/models/Category";
import mongoose from "mongoose";

/** Helper: Get user from Authorization header */
function getUserFromRequest(req: NextRequest): DecodedToken | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    return verifyToken(token);
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

/** Define Answer type once for TypeScript */
type Answer = {
  questionId: string | mongoose.Types.ObjectId;
  answer: string;
  actionId?: mongoose.Types.ObjectId;
};

/** CREATE INSPECTION */
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.role?.toLowerCase() === "Subcontractor") {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 });
  }

  try {
    await connectDB();

    const userCheck = getUserFromRequest(req);
    if (!userCheck)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, date, categoryId, subcontractorId, description } =
      await req.json();

    if (!title || !date || !categoryId || !subcontractorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const inspection = await Inspection.create({
      title,
      date,
      categoryId,
      subcontractorId,
      createdBy: userCheck.id,
      status: "Draft",
      description: description || "",
      answers: [],
    });

    return NextResponse.json(inspection, { status: 201 });
  } catch (error: any) {
    console.error("Create Inspection Error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create inspection" },
      { status: 500 }
    );
  }
}

/** GET INSPECTIONS */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filter: any = {};
    if (user.role?.toLowerCase() === "Subcontractor") {
      filter.subcontractorId = user.id;
    }

    const inspections = await Inspection.find(filter).lean().sort({ createdAt: -1 });

    const populated = await Promise.all(
      inspections.map(async (insp) => {
        let createdBy = { name: "Unknown", role: "N/A" };
        if (insp.createdBy) {
          const dbUser = await User.findById(insp.createdBy).select("name role").lean();
          if (dbUser) createdBy = dbUser;
        }

        let assignedJS = { name: "Unassigned", role: "N/A" };
        if (insp.subcontractorId) {
          const dbUser = await User.findById(insp.subcontractorId).select("name role").lean();
          if (dbUser) assignedJS = dbUser;
        }

        let category = { name: "N/A" };
        if (insp.categoryId) {
          const cat = await Category.findById(insp.categoryId).select("name").lean();
          if (cat) category = cat;
        }

        const findingsCount = (insp.answers as Answer[] || []).filter(
          (ans) => ans.answer === "No" && !ans.actionId
        ).length;

        return {
          ...insp,
          createdBy,
          assignedJS,
          category,
          findings: findingsCount,
        };
      })
    );

    return NextResponse.json(populated, { status: 200 });
  } catch (err: any) {
    console.error("Fetch Inspections Error:", err.message, err.stack);
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 });
  }
}
