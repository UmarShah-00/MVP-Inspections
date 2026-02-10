import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
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

    // 3️⃣ Filter safely
    const filter: any = {};
    if (user && user.role === "Subcontractor") {
      filter.assignee = user.id;
    }

    // 4️⃣ Aggregate actions by month + status
    const data = await Action.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Actions Trend API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
