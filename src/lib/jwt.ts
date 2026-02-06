import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function signToken(payload: DecodedToken) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): DecodedToken {
  const decoded = jwt.verify(token, JWT_SECRET);

  // 🔒 Type guard
  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  return decoded as DecodedToken;
}
