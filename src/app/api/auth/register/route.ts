import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password, role } = await req.json(); 
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required" },
      { status: 400 },
    );
  }

  const allowedRoles = ["Default", "Main Contractor", "Subcontractor"];
  const roleValue = allowedRoles.includes(role) ? role : "Default";

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name, 
    email,
    password: hashedPassword,
    role: roleValue,
  });

  return NextResponse.json({
    message: "User created",
    user: { name: user.name, email: user.email, role: user.role }, 
  });
}
