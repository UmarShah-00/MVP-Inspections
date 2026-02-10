import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Category from "@/models/Category";
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

    // 4️⃣ Group inspections by categoryId
    const data = await Inspection.aggregate([
      { $match: filter },
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
    ]);

    // 5️⃣ Map category names safely
    const mapped = await Promise.all(
      data.map(async (d: any) => {
        const category = await Category.findById(d._id).lean();

        return {
          name: category?.name || "N/A",
          value: d.count,
        };
      })
    );

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Inspection Category API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
