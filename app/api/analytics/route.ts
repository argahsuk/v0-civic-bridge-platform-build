// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getMockAnalytics } from "@/lib/mock-data"; //

export async function GET() {
  try {
    try {
      await connectDB();
      // ... existing DB analytics logic ...
      
      // If no data exists in DB, use mock analytics
      const stats = getMockAnalytics(); //
      return NextResponse.json(stats);
    } catch (dbError) {
      // Fallback for local development without DB
      const stats = getMockAnalytics(); //
      return NextResponse.json(stats);
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
