import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/lib/models/issue";
import { VALID_STATUSES } from "@/lib/constants";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, note, image } = await request.json();

    if (!status || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    issue.status = status;
    issue.statusHistory.push({
      status,
      note: note || "",
      timestamp: new Date(),
    });

    if (status === "Resolved" && !issue.resolvedAt) {
      issue.resolvedAt = new Date();
    }

    if (image) {
      issue.image = image;
    }

    await issue.save();

    return NextResponse.json({ issue });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
