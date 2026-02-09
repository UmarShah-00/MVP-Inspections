// /app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Action from "@/models/Action";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  const user: any = getUserFromRequest(req as any);

  // Filter inspections and actions for subcontractor
  const inspectionFilter =
    user.role === "Subcontractor" ? { subcontractorId: user.id } : {};

  const actionFilter =
    user.role === "Subcontractor" ? { assignee: user.id } : {};

  const totalInspections = await Inspection.countDocuments(inspectionFilter);
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
}
