import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // 1️⃣ DB connect (safe)
    await connectDB();

    // 2️⃣ User extract (safe for Vercel build)
    let user: any = null;
    try {
      user = getUserFromRequest(req as any);
    } catch (err) {
      user = null;
    }

    // 3️⃣ Filter safely
    const filter =
      user && user.role === "Subcontractor"
        ? { subcontractorId: user.id }
        : {};

    // 4️⃣ Mongo aggregation
    const data = await Inspection.aggregate([
      { $match: filter },
      { $group: { _id: "$status", actions: { $sum: 1 } } },
    ]);

    // 5️⃣ Response format
    const response = data.map((d: any) => ({
      name: d._id === "Draft" ? "Open" : "Closed",
      actions: d.actions,
    }));

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
