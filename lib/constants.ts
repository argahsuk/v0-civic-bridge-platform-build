export const VALID_STATUSES = [
  "Submitted",
  "Acknowledged",
  "Assigned",
  "In Progress",
  "Resolved",
  "Verified",
] as const;

export const CATEGORIES = [
  "Roads & Potholes",
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Public Safety",
  "Parks & Recreation",
  "Building & Zoning",
  "Noise Complaint",
  "Other",
] as const;

export const SEVERITIES = ["Low", "Medium", "High"] as const;
