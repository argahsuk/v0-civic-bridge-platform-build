"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { Navbar } from "@/components/navbar";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { StatusTimeline } from "@/components/status-timeline";
import { getSlaInfo, getSlaColorClass } from "@/lib/sla";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  Clock,
  MapPin,
  ArrowLeft,
  Flame,
  Loader2,
  User as UserIcon,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface IssueDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  image?: string;
  location: { lat: number; lng: number };
  upvotes: string[];
  createdBy: { _id: string; name: string; email: string };
  createdAt: string;
  resolvedAt?: string;
  statusHistory: Array<{
    status: string;
    updatedBy: { name?: string } | string;
    note?: string;
    timestamp: string;
  }>;
}

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [upvoting, setUpvoting] = useState(false);

  const { data, isLoading, mutate } = useSWR<{ issue: IssueDetail }>(
    `/api/issues/${id}`,
    fetcher
  );

  const issue = data?.issue;

  async function handleUpvote() {
    setUpvoting(true);
    try {
      const res = await fetch(`/api/issues/${id}/upvote`, { method: "POST" });
      if (res.ok) {
        await mutate();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to upvote");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setUpvoting(false);
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (!issue) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Issue not found</h1>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </main>
      </>
    );
  }

  const sla = getSlaInfo(issue.createdAt);
  const isResolved = issue.status === "Resolved" || issue.status === "Verified";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary">{issue.category}</Badge>
                  <SeverityBadge severity={issue.severity} />
                  <StatusBadge status={issue.status} />
                  {!isResolved && (
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getSlaColorClass(sla.color)
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      {sla.label}
                    </span>
                  )}
                </div>
                <CardTitle className="text-2xl leading-tight text-balance">
                  {issue.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {issue.description}
                </p>

                {issue.image && (
                  <div className="overflow-hidden rounded-lg border border-border">
                    <img
                      src={issue.image}
                      alt="Issue photo"
                      className="w-full object-cover max-h-96"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
                  <span className="flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4" />
                    {issue.createdBy?.name || "Anonymous"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(issue.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline history={issue.statusHistory} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                    {issue.upvotes.length > 2 && (
                      <Flame className="h-6 w-6 text-destructive" />
                    )}
                    {issue.upvotes.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Community Upvotes</p>
                  <Button
                    onClick={handleUpvote}
                    disabled={upvoting}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {upvoting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    Upvote
                  </Button>
                </div>
              </CardContent>
            </Card>

            {issue.resolvedAt && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-success">Resolved</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(issue.resolvedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
