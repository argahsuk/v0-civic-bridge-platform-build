"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { getSlaInfo, getSlaColorClass } from "@/lib/sla";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { VALID_STATUSES } from "@/lib/models/issue";
import {
  Loader2,
  Shield,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

export default function OfficialPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");

  const params = new URLSearchParams();
  if (statusFilter !== "all") params.set("status", statusFilter);

  const { data, isLoading, mutate } = useSWR<{ issues: IssueData[] }>(
    `/api/issues?${params.toString()}`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const issues = data?.issues || [];

  if (!authLoading && (!user || user.role !== "official")) {
    router.push("/login");
    return null;
  }

  const totalIssues = issues.length;
  const openIssues = issues.filter(
    (i) => !["Resolved", "Verified"].includes(i.status)
  ).length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved").length;
  const highSeverity = issues.filter(
    (i) => i.severity === "High" && !["Resolved", "Verified"].includes(i.status)
  ).length;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Official Panel
              </h1>
            </div>
            <p className="mt-1 text-muted-foreground">
              Manage civic issues and update statuses
            </p>
          </div>
          <Link href="/official/analytics">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Issues"
            value={totalIssues}
            icon={<FileText className="h-5 w-5 text-primary" />}
          />
          <StatCard
            label="Open"
            value={openIssues}
            icon={<Clock className="h-5 w-5 text-warning" />}
          />
          <StatCard
            label="Resolved"
            value={resolvedIssues}
            icon={<CheckCircle className="h-5 w-5 text-success" />}
          />
          <StatCard
            label="High Severity"
            value={highSeverity}
            icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
          />
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Filter by status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {VALID_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Issues Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <p className="text-lg font-semibold text-foreground">No issues found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {issues.map((issue) => (
              <OfficialIssueRow
                key={issue._id}
                issue={issue}
                onUpdated={() => mutate()}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function OfficialIssueRow({
  issue,
  onUpdated,
}: {
  issue: IssueData;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(issue.status);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const sla = getSlaInfo(issue.createdAt);
  const isResolved = issue.status === "Resolved" || issue.status === "Verified";

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/issues/${issue._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });

      if (res.ok) {
        toast.success("Status updated");
        setOpen(false);
        setNote("");
        onUpdated();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <Link
            href={`/issues/${issue._id}`}
            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {issue.title}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <SeverityBadge severity={issue.severity} />
            <StatusBadge status={issue.status} />
            {!isResolved && (
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  getSlaColorClass(sla.color)
                )}
              >
                <Clock className="h-3 w-3" />
                {sla.label}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {issue.upvoteCount} upvotes
            </span>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Update Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Issue Status</DialogTitle>
              <DialogDescription className="line-clamp-1">
                {issue.title}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Note</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about this status change..."
                  rows={3}
                />
              </div>
              <Button onClick={handleUpdate} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
