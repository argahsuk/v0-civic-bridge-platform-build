import mongoose, { Schema, type Document } from "mongoose";
import { VALID_STATUSES, CATEGORIES } from "@/lib/constants";

export interface IStatusHistoryEntry {
  status: string;
  updatedBy: mongoose.Types.ObjectId;
  note: string;
  timestamp: Date;
}

export interface IIssue extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  severity: "Low" | "Medium" | "High";
  image?: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  upvotes: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  resolvedAt?: Date;
  statusHistory: IStatusHistoryEntry[];
}

const StatusHistorySchema = new Schema<IStatusHistoryEntry>(
  {
    status: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const IssueSchema = new Schema<IIssue>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
  image: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Verified"],
    default: "Submitted",
  },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  statusHistory: [StatusHistorySchema],
});

export const Issue = mongoose.models.Issue || mongoose.model<IIssue>("Issue", IssueSchema);

export { VALID_STATUSES, CATEGORIES } from "@/lib/constants";
