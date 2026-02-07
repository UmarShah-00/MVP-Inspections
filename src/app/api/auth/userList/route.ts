// app/api/auth/userList/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { verifyToken, type DecodedToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 🔹 Get logged-in user from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let user: DecodedToken;

    try {
      user = verifyToken(token);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ❌ Subcontractor ko block karna
    if (user.role?.toLowerCase() === "subcontractor") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // ✅ Fetch allowed users
    const users = await User.find({
      role: { $in: ["Subcontractor", "Main Contractor"] },
    }).sort({ name: 1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
