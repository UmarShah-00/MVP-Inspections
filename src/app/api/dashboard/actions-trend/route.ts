import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();
  const user: any = getUserFromRequest(req as any);
  const filter = user.role === "Subcontractor" ? { subcontractorId: user.id } : {};

  const data = await Inspection.aggregate([
    { $match: filter },
    { $group: { _id: { month: { $month: "$createdAt" }, status: "$status" }, count: { $sum: 1 } } },
  ]);

  return NextResponse.json(data);
}
