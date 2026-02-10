import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Connect DB
    await connectDB();

    // 2️⃣ Parse request safely
    let body: { email?: string; password?: string } = { email: "", password: "" };
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // 3️⃣ Find user
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4️⃣ Compare password safely
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 5️⃣ Sign JWT
    const token = signToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // 6️⃣ Return response
    return NextResponse.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
