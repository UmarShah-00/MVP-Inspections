import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return NextResponse.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role, 
    },
  });
}
