import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/lib/models/issue";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Use a random ObjectId as an anonymous upvote identifier
    const anonId = new mongoose.Types.ObjectId();
    issue.upvotes.push(anonId);
    await issue.save();

    return NextResponse.json({
      upvotes: issue.upvotes,
      upvoteCount: issue.upvotes.length,
    });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
