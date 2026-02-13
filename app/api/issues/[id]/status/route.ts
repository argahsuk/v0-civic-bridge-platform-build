import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue, VALID_STATUSES } from "@/lib/models/issue";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "official") {
      return NextResponse.json(
        { error: "Only officials can update status" },
        { status: 403 }
      );
    }

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
      updatedBy: session.userId,
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
