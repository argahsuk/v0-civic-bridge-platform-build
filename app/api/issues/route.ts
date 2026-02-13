import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/lib/models/issue";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "newest";

    const filter: Record<string, string> = {};
    if (category && category !== "all") filter.category = category;
    if (severity && severity !== "all") filter.severity = severity;
    if (status && status !== "all") filter.status = status;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "upvotes") sortOption = { upvoteCount: -1 };
    if (sort === "oldest_open") sortOption = { createdAt: 1 };

    const issues = await Issue.aggregate([
      { $match: filter },
      {
        $addFields: {
          upvoteCount: { $size: "$upvotes" },
        },
      },
      { $sort: sortOption },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          severity: 1,
          status: 1,
          upvotes: 1,
          upvoteCount: 1,
          createdAt: 1,
          resolvedAt: 1,
          location: 1,
          "creator.name": 1,
          statusHistory: 1,
        },
      },
    ]);

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Get issues error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, severity, image, location } = body;

    if (!title || !description || !category || !severity || !location?.lat || !location?.lng) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const issue = await Issue.create({
      title,
      description,
      category,
      severity,
      image: image || undefined,
      location,
      status: "Submitted",
      createdBy: session.userId,
      upvotes: [],
      statusHistory: [
        {
          status: "Submitted",
          updatedBy: session.userId,
          note: "Issue submitted",
          timestamp: new Date(),
        },
      ],
    });

    return NextResponse.json({ issue }, { status: 201 });
  } catch (error) {
    console.error("Create issue error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
