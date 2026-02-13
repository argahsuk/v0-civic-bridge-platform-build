import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/lib/models/issue";
import { getSession } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Must be logged in to upvote" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(session.userId);
    const hasUpvoted = issue.upvotes.some(
      (uid: mongoose.Types.ObjectId) => uid.toString() === session.userId
    );

    if (hasUpvoted) {
      // Remove upvote
      issue.upvotes = issue.upvotes.filter(
        (uid: mongoose.Types.ObjectId) => uid.toString() !== session.userId
      );
    } else {
      issue.upvotes.push(userId);
    }

    await issue.save();

    return NextResponse.json({
      upvotes: issue.upvotes,
      upvoteCount: issue.upvotes.length,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
