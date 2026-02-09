import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
