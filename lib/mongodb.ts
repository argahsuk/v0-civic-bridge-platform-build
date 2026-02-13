import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  uri: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.startsWith("mongodb")) {
    throw new Error(
      "MONGODB_URI is missing or invalid. Please set a valid MongoDB Atlas connection string (mongodb+srv://...) in the Vars section of the sidebar."
    );
  }

  // If URI changed (e.g. user updated env var), reset the cached connection
  if (cached.uri && cached.uri !== uri) {
    cached.conn = null;
    cached.promise = null;
    cached.uri = null;
    // Disconnect previous connection if any
    try { await mongoose.disconnect(); } catch { /* ignore */ }
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.uri = uri;
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.uri = null;
    throw e;
  }

  return cached.conn;
}
