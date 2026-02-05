import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/db"; 
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectMongo();

    const categories = await Category.find().lean();

    return NextResponse.json({ categories }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
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

    const existing = await Category.findOne({ code });
    if (existing) {
      return NextResponse.json(
        { message: "Category code already exists" },
        { status: 400 },
      );
    }

    // Create new category
    const category = await Category.create({ code, name, description });

    return NextResponse.json(
      { message: "Category saved successfully", category },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
