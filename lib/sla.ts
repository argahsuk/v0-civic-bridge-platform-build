export function getSlaInfo(createdAt: string | Date) {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(diffHours / 24);
  const hours = Math.floor(diffHours % 24);

  let color: "green" | "yellow" | "red" = "green";
  if (diffHours >= 48) color = "red";
  else if (diffHours >= 24) color = "yellow";

  let label = "";
  if (days > 0) label += `${days}d `;
  label += `${hours}h`;

  return { color, label: `Open for ${label}`, diffHours };
}

export function getSlaColorClass(color: "green" | "yellow" | "red") {
  switch (color) {
    case "green":
      return "bg-success/10 text-success";
    case "yellow":
      return "bg-warning/10 text-warning";
    case "red":
      return "bg-destructive/10 text-destructive";
  }
}
