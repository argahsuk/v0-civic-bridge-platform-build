import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Submitted: "bg-muted text-muted-foreground border-border",
  Acknowledged: "bg-primary/10 text-primary border-primary/20",
  Assigned: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  "In Progress": "bg-warning/10 text-warning border-warning/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Verified: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>
      {status}
    </Badge>
  );
}
