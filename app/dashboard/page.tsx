"use client";

import { useState } from "react";
import useSWR from "swr";
import { Navbar } from "@/components/navbar";
import { IssueCard } from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/models/issue";
import { Loader2, LayoutGrid, SlidersHorizontal } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface IssueData {
  _id: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  upvotes: string[];
  upvoteCount: number;
  createdAt: string;
  creator?: { name: string };
  location?: { lat: number; lng: number };
}

export default function DashboardPage() {
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (severity !== "all") params.set("severity", severity);
  if (status !== "all") params.set("status", status);
  params.set("sort", sort);

  const { data, isLoading } = useSWR<{ issues: IssueData[] }>(
    `/api/issues?${params.toString()}`,
    fetcher,
    { refreshInterval: 15000 }
  );

  const issues = data?.issues || [];
  const maxUpvotes = issues.length > 0 ? Math.max(...issues.map((i) => i.upvoteCount)) : 0;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Public Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Track civic issues reported by the community
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <div className="flex flex-1 flex-wrap gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="oldest_open">Oldest Open</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(category !== "all" || severity !== "all" || status !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory("all");
                setSeverity("all");
                setStatus("all");
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
            <LayoutGrid className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No issues found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or be the first to report an issue.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {issues.length} issue{issues.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {issues.map((issue) => (
                <IssueCard key={issue._id} issue={issue} maxUpvotes={maxUpvotes} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
