// app/api/actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Action from "@/models/Action";
import Inspection from "@/models/Inspection";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Fetch all actions with inspection and JS info
    const actions = await Action.find()
      .populate("inspectionId", "title createdBy")
      .lean();

    // Map actions to include createdBy name/role from users
    const mapped = await Promise.all(
      actions.map(async (a, idx) => {
        const inspection = a.inspectionId as any;
        let createdByName = "N/A";
        let createdByRole = "N/A";

        if (inspection?.createdBy) {
          const user = await User.findById(inspection.createdBy).lean();
          if (user) {
            createdByName = user.name;
            createdByRole = user.role;
          }
        }

        return {
          number: idx + 1, // # column
          _id: a._id,
          title: a.title,
          inspectionTitle: inspection?.title || "N/A",
          createdByName,
          createdByRole,
          assignee: a.assignee,
          dueDate: a.dueDate.toISOString().split("T")[0],
          status: a.status,
          evidence: a.evidence || [], // array of image paths
        };
      }),
    );

    return NextResponse.json({ actions: mapped }, { status: 200 });
  } catch (err: any) {
    console.error("GET Actions Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch actions" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { actionId, status } = body;

    if (!actionId || !status) {
      return NextResponse.json(
        { error: "actionId and status are required" },
        { status: 400 },
      );
    }

    const action = await Action.findById(actionId);
    if (!action)
      return NextResponse.json({ error: "Action not found" }, { status: 404 });

    action.status = status as any;
    await action.save();

    return NextResponse.json(
      { message: "Status updated", action },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("PATCH Action Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update action" },
      { status: 500 },
    );
  }
}
