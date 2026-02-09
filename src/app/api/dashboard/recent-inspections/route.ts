import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Category from "@/models/Category";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user: any = getUserFromRequest(req as any);
    const filter = user.role === "Subcontractor" ? { subcontractorId: user.id } : {};

    // Populate category and subcontractor
    const data = await Inspection.find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: "categoryId", model: Category, select: "name" })
      .populate({ path: "subcontractorId", model: User, select: "name" })
      .lean();

    // Map to frontend-friendly format
    const formatted = data.map(d => ({
      _id: d._id,
      title: d.title,
      status: d.status,
      category: d.categoryId?.name || "N/A",
      subcontractor: d.subcontractorId?.name || "N/A",
      createdAt: d.createdAt,
    }));

    return NextResponse.json(formatted);

  } catch (err) {
    console.error("Recent inspections error:", err);
    return NextResponse.json({ error: "Failed to fetch recent inspections" }, { status: 500 });
  }
}
