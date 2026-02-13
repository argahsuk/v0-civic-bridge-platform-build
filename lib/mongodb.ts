import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  console.log("[v0] connectDB called, uri exists:", !!uri, "uri starts with:", uri?.substring(0, 14));

  if (!uri || !uri.startsWith("mongodb")) {
    throw new Error(
      "MONGODB_URI is missing or invalid. Please set a valid MongoDB Atlas connection string (mongodb+srv://...) in your project Vars."
    );
  }

  if (!cached.promise) {
    console.log("[v0] Creating new mongoose connection to:", uri.substring(0, 30) + "...");
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
