import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/db";
import Category from "@/models/Category";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongo();
    const category = await Category.findById(params.id).lean();
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ category }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const { code, name, description } = body;

    if (!code || !name) {
      return NextResponse.json(
        { message: "Code and Name are required" },
        { status: 400 },
      );
    }

    await connectMongo();

    // Check for duplicate code in other categories
    const existing = await Category.findOne({ code, _id: { $ne: params.id } });
    if (existing) {
      return NextResponse.json(
        { message: "Category code already exists" },
        { status: 400 },
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      { code, name, description },
      { new: true },
    );

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const deleted = await Category.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ message: "Category not found" }, { status: 404 });
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
}