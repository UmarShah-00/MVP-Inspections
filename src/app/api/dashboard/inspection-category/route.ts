import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";
import Category from "@/models/Category"; 
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  const user: any = getUserFromRequest(req as any);
  const filter = user.role === "Subcontractor" ? { subcontractorId: user.id } : {};

  // Group inspections by categoryId
  const data = await Inspection.aggregate([
    { $match: filter },
    { $group: { _id: "$categoryId", count: { $sum: 1 } } },
  ]);

  // Map category names
  const mapped = await Promise.all(
    data.map(async (d) => {
      const category = await Category.findById(d._id).lean();
      return {
        name: category?.name || "N/A",
        value: d.count,
      };
    })
  );

  return NextResponse.json(mapped);
}
