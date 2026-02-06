import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inspection from "@/models/Inspection";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = params;

    const inspection = await Inspection.findById(id)
      .populate("categoryId", "name") 
      .populate("subcontractorId", "name") 
      .lean(); 

    if (!inspection) {
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ inspection }, { status: 200 });
  } catch (err: any) {
    console.error("GET Inspection Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch inspection" },
      { status: 500 },
    );
  }
}
// PATCH -> update inspection
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = params;
    const { title, date, categoryId, subcontractorId, description } =
      await req.json();

    const inspection = await Inspection.findById(id);
    if (!inspection)
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 },
      );

    inspection.title = title ?? inspection.title;
    inspection.date = date ?? inspection.date;
    inspection.categoryId = categoryId ?? inspection.categoryId;
    inspection.subcontractorId = subcontractorId ?? inspection.subcontractorId;
    inspection.description = description ?? inspection.description;

    await inspection.save();

    return NextResponse.json(
      { message: "Inspection updated", inspection },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("PATCH Inspection Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update inspection" },
      { status: 500 },
    );
  }
}

// DELETE -> delete inspection
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Inspection.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { error: "Inspection not found" },
        { status: 404 },
      );

    return NextResponse.json(
      { message: "Inspection deleted successfully" },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("DELETE Inspection Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete inspection" },
      { status: 500 },
    );
  }
}
