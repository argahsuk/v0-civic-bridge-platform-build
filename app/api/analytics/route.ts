import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/lib/models/issue";

export async function GET() {
  try {
    await connectDB();

    const totalIssues = await Issue.countDocuments();
    const openIssues = await Issue.countDocuments({
      status: { $nin: ["Resolved", "Verified"] },
    });
    const resolvedIssues = await Issue.countDocuments({
      status: { $in: ["Resolved", "Verified"] },
    });

    // Average resolution time
    const avgResolutionResult = await Issue.aggregate([
      { $match: { resolvedAt: { $exists: true, $ne: null } } },
      {
        $project: {
          resolutionTime: {
            $subtract: ["$resolvedAt", "$createdAt"],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: "$resolutionTime" },
        },
      },
    ]);

    const avgResolutionMs = avgResolutionResult[0]?.avgTime || 0;
    const avgResolutionHours = Math.round(avgResolutionMs / (1000 * 60 * 60));

    // Most common category
    const categoryResult = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const mostCommonCategory = categoryResult[0]?._id || "N/A";

    // Trending issue (most upvotes)
    const trendingResult = await Issue.aggregate([
      { $addFields: { upvoteCount: { $size: "$upvotes" } } },
      { $sort: { upvoteCount: -1 } },
      { $limit: 1 },
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
          upvoteCount: 1,
          status: 1,
          "creator.name": 1,
        },
      },
    ]);

    const trendingIssue = trendingResult[0] || null;

    // Status distribution
    const statusDistribution = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Category distribution
    const categoryDistribution = categoryResult.map((c: { _id: string; count: number }) => ({
      category: c._id,
      count: c.count,
    }));

    // Severity distribution
    const severityDistribution = await Issue.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Issues over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const issuesOverTime = await Issue.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      totalIssues,
      openIssues,
      resolvedIssues,
      avgResolutionHours,
      mostCommonCategory,
      trendingIssue,
      statusDistribution: statusDistribution.map((s: { _id: string; count: number }) => ({
        status: s._id,
        count: s.count,
      })),
      categoryDistribution,
      severityDistribution: severityDistribution.map((s: { _id: string; count: number }) => ({
        severity: s._id,
        count: s.count,
      })),
      issuesOverTime: issuesOverTime.map((d: { _id: string; count: number }) => ({
        date: d._id,
        count: d.count,
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
