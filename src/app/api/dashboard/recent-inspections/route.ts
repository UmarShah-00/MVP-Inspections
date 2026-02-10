import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Category from "@/models/Category";
import User from "@/models/User";
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
    const filter =
      user && user.role === "Subcontractor"
        ? { subcontractorId: user.id }
        : {};

    // 4️⃣ Fetch recent inspections
    const data = await Inspection.find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: "categoryId", model: Category, select: "name" })
      .populate({ path: "subcontractorId", model: User, select: "name" })
      .lean();

    // 5️⃣ Frontend-friendly format
    const formatted = data.map((d: any) => ({
      _id: d._id,
      title: d.title,
      status: d.status,
      category: d.categoryId?.name || "N/A",
      subcontractor: d.subcontractorId?.name || "N/A",
      createdAt: d.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Recent inspections API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch recent inspections" },
      { status: 500 }
    );
  }
}
