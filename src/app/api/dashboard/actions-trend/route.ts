import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Action from "@/models/Action";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  const user: any = getUserFromRequest(req as any);
  const filter: any = {};

  // Agar Subcontractor ho to sirf unke actions
  if (user.role === "Subcontractor") filter.assignee = user.id;

  // Aggregate actions by month and status
  const data = await Action.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, status: "$status" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  return NextResponse.json(data);
}
