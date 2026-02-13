"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Loader2,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  Timer,
  Tag,
  Flame,
} from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const PIE_COLORS = [
  "hsl(217, 91%, 50%)",
  "hsl(142, 71%, 45%)",
  "hsl(0, 72%, 51%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(190, 80%, 42%)",
];

interface AnalyticsData {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  avgResolutionHours: number;
  mostCommonCategory: string;
  trendingIssue: {
    _id: string;
    title: string;
    upvoteCount: number;
    status: string;
  } | null;
  statusDistribution: { status: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  severityDistribution: { severity: string; count: number }[];
  issuesOverTime: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, isLoading } = useSWR<AnalyticsData>("/api/analytics", fetcher);

  if (!authLoading && (!user || user.role !== "official")) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link
          href="/official"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Official Panel
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Performance metrics and governance insights
          </p>
        </div>

        {isLoading || !data ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
              <MetricCard
                label="Total Issues"
                value={data.totalIssues}
                icon={<FileText className="h-5 w-5 text-primary" />}
              />
              <MetricCard
                label="Open Issues"
                value={data.openIssues}
                icon={<Clock className="h-5 w-5 text-warning" />}
              />
              <MetricCard
                label="Resolved"
                value={data.resolvedIssues}
                icon={<CheckCircle className="h-5 w-5 text-success" />}
              />
              <MetricCard
                label="Avg Resolution"
                value={`${data.avgResolutionHours}h`}
                icon={<Timer className="h-5 w-5 text-primary" />}
              />
              <MetricCard
                label="Top Category"
                value={data.mostCommonCategory}
                icon={<Tag className="h-5 w-5 text-chart-5" />}
                isText
              />
              <MetricCard
                label="Trending"
                value={data.trendingIssue?.title || "None"}
                icon={<Flame className="h-5 w-5 text-destructive" />}
                isText
              />
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.statusDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={data.statusDistribution}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={50}
                          paddingAngle={2}
                          label={({ status, count }) => `${status}: ${count}`}
                          labelLine={false}
                        >
                          {data.statusDistribution.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                      No data yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Issues by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.categoryDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={data.categoryDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 89%)" />
                        <XAxis
                          dataKey="category"
                          tick={{ fontSize: 11 }}
                          angle={-30}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="hsl(217, 91%, 50%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                      No data yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Issues Over Time */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Issues Over Time (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.issuesOverTime.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={data.issuesOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 89%)" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="hsl(217, 91%, 50%)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                      No data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function MetricCard({
  label,
  value,
  icon,
  isText = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isText?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 pt-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p
            className={
              isText
                ? "text-sm font-semibold text-foreground line-clamp-1"
                : "text-2xl font-bold text-foreground"
            }
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
