// /lib/db.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "❌ Please define the MONGO_URI environment variable in .env.local",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(MONGO_URI!) 
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default connectDB;
