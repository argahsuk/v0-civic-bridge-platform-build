"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { getSlaInfo, getSlaColorClass } from "@/lib/sla";
import { ThumbsUp, Clock, MapPin, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueCardProps {
  issue: {
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
  };
  maxUpvotes?: number;
}

export function IssueCard({ issue, maxUpvotes = 0 }: IssueCardProps) {
  const sla = getSlaInfo(issue.createdAt);
  const isTrending = maxUpvotes > 0 && issue.upvoteCount === maxUpvotes && issue.upvoteCount > 0;
  const isResolved = issue.status === "Resolved" || issue.status === "Verified";

  return (
    <Link href={`/issues/${issue._id}`}>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
        {isTrending && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1" variant="outline">
              <Flame className="h-3 w-3" />
              Trending
            </Badge>
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2 pr-20">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {issue.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="secondary" className="text-xs font-normal">
              {issue.category}
            </Badge>
            <SeverityBadge severity={issue.severity} />
            <StatusBadge status={issue.status} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5" />
                {issue.upvoteCount}
              </span>
              {!isResolved && (
                <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", getSlaColorClass(sla.color))}>
                  <Clock className="h-3 w-3" />
                  {sla.label}
                </span>
              )}
            </div>
            {issue.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {issue.location.lat.toFixed(2)}, {issue.location.lng.toFixed(2)}
                </span>
              </span>
            )}
          </div>
          {issue.creator && (
            <p className="mt-2 text-xs text-muted-foreground">
              Reported by {issue.creator.name} &middot;{" "}
              {new Date(issue.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
