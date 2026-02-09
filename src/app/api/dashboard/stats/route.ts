import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();
  const user: any = getUserFromRequest(req as any);
  const filter = user.role === "Subcontractor" ? { subcontractorId: user.id } : {};

  const totalInspections = await Inspection.countDocuments(filter);
  const openActions = await Inspection.countDocuments({ ...filter, status: "Draft" });
  const closedActions = await Inspection.countDocuments({ ...filter, status: "Submitted" });

  return NextResponse.json({ totalInspections, openActions, closedActions });
}
