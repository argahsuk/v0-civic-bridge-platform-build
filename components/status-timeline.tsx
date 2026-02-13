import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  status: string;
  updatedBy?: { name?: string } | string;
  note?: string;
  timestamp: string;
}

export function StatusTimeline({ history }: { history: TimelineEntry[] }) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative flex flex-col gap-0">
      {sortedHistory.map((entry, index) => {
        const isLatest = index === 0;
        const updaterName =
          typeof entry.updatedBy === "object" && entry.updatedBy?.name
            ? entry.updatedBy.name
            : "System";

        return (
          <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Line */}
            {index < sortedHistory.length - 1 && (
              <div className="absolute left-[11px] top-7 h-full w-px bg-border" />
            )}

            {/* Dot */}
            <div className="relative z-10 mt-0.5 flex-shrink-0">
              {isLatest ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground/40" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isLatest ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {entry.status}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {updaterName} &middot;{" "}
                {new Date(entry.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              {entry.note && (
                <p className="mt-1 text-sm text-foreground/80">{entry.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
