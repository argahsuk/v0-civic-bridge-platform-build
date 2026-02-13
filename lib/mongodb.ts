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

  if (!uri || !uri.startsWith("mongodb")) {
    throw new Error(
      "MONGODB_URI is missing or invalid. Please set a valid MongoDB Atlas connection string (mongodb+srv://...) in the Vars section of the sidebar."
    );
  }

  if (uri.includes("localhost") || uri.includes("127.0.0.1")) {
    throw new Error(
      "MONGODB_URI points to localhost which is not available in this environment. Please use a MongoDB Atlas cloud connection string (mongodb+srv://...). You can get one free at https://cloud.mongodb.com"
    );
  }

  if (!cached.promise) {
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
