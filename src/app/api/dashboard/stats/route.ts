import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Action from "@/models/Action";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // 1️⃣ DB connect (safe)
    await connectDB();

    // 2️⃣ User extract (build-safe)
    let user: any = null;
    try {
      user = getUserFromRequest(req as any);
    } catch (err) {
      user = null;
    }

    // 3️⃣ Filters safely
    const inspectionFilter =
      user && user.role === "Subcontractor"
        ? { subcontractorId: user.id }
        : {};

    const actionFilter =
      user && user.role === "Subcontractor"
        ? { assignee: user.id }
        : {};

    // 4️⃣ Stats queries
    const totalInspections = await Inspection.countDocuments(
      inspectionFilter
    );

    const openActions = await Action.countDocuments({
      ...actionFilter,
      status: { $in: ["Open", "In Progress"] },
    });

    const closedActions = await Action.countDocuments({
      ...actionFilter,
      status: "Closed",
    });

    return NextResponse.json({
      totalInspections,
      openActions,
      closedActions,
    });
  } catch (error: any) {
    console.error("Dashboard Stats API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
