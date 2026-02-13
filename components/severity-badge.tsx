import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const severityStyles: Record<string, string> = {
  Low: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  High: "bg-destructive/10 text-destructive border-destructive/20",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", severityStyles[severity])}>
      {severity}
    </Badge>
  );
}
