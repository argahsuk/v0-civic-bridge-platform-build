import mongoose, { Schema, type Document } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  userId: mongoose.Types.ObjectId;
  role: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema = new Schema<ISession>({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
