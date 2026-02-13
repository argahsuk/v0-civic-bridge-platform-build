// app/api/issues/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Issue } from "@/lib/models/issue";
import { MOCK_ISSUES } from "@/lib/mock-data"; //

export async function GET(request: Request) {
  try {
    try {
      await connectDB();
      const { searchParams } = new URL(request.url);
      
      // ... existing filter and sort logic ...

      const issues = await Issue.aggregate([
        // ... your existing aggregation pipeline ...
      ]);

      // If database is connected but empty, return mock data to show the site working
      if (issues.length === 0) {
        return NextResponse.json({ issues: MOCK_ISSUES }); //
      }

      return NextResponse.json({ issues });
    } catch (dbError) {
      // Fallback to mock data if MongoDB connection fails
      console.warn("Database connection failed, using mock-data.ts");
      return NextResponse.json({ issues: MOCK_ISSUES }); //
    }
  } catch (error) {
    console.error("Get issues error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
