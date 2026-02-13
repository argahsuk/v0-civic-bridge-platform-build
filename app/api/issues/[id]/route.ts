import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/lib/models/issue";
import { User } from "@/lib/models/user";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const issue = await Issue.findById(id)
      .populate("createdBy", "name email")
      .populate("statusHistory.updatedBy", "name")
      .lean();

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Also populate the creator name
    if (issue.createdBy && typeof issue.createdBy === "object") {
      // Already populated
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error("Get issue error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
