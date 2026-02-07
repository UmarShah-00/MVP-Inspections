// app/api/actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Action from "@/models/Action";
import User from "@/models/User";
import { verifyToken, type DecodedToken } from "@/lib/jwt";
import Inspection from "@/models/Inspection";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: DecodedToken;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;
    const userRole = decoded.role?.toLowerCase() || "";

    // Subcontractor sees only their actions
    const query: any = userRole === "subcontractor" ? { assignee: userId } : {};

    const actions = await Action.find(query)
      .populate({
        path: "inspectionId",
        select: "title createdBy",
        model: Inspection,
      })
      .lean();

    const mapped = await Promise.all(
      actions.map(async (a, idx) => {
        const inspection = a.inspectionId as any;

        // ✅ Role-based Created By logic
        let createdByName = "N/A";
        let createdByRole = "N/A";

        if (userRole === "subcontractor") {
          // Subcon sees action creator = JS who created inspection
          if (inspection?.createdBy) {
            const user = await User.findById(inspection.createdBy).lean();
            if (user) {
              createdByName = user.name;
              createdByRole = user.role;
            }
          }
        } else {
          // Main contractor sees Assigned JS
          const assigneeId = a.assignee;
          const user = await User.findById(assigneeId).lean();
          if (user) {
            createdByName = user.name;
            createdByRole = user.role;
          }
        }

        return {
          number: idx + 1,
          _id: a._id,
          title: a.title,
          inspectionTitle: inspection?.title || "N/A",
          createdByName,
          createdByRole,
          assignee: a.assignee.toString(),
          dueDate: a.dueDate.toISOString().split("T")[0],
          status: a.status,
          evidence: a.evidence || [],
        };
      })
    );

    return NextResponse.json({ actions: mapped }, { status: 200 });
  } catch (err: any) {
    console.error("GET Actions Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch actions" },
      { status: 500 }
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
