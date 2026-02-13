const now = Date.now();
const hour = 3600000;
const day = 86400000;

export const MOCK_ISSUES = [
  {
    _id: "mock-1",
    title: "Massive pothole on Oak Street near school zone",
    description:
      "There is a dangerous pothole approximately 2 feet wide on Oak Street, right near Lincoln Elementary. Multiple cars have been damaged, and it poses a serious safety risk for pedestrians and cyclists. The pothole has been growing for the past two weeks after heavy rain.",
    category: "Roads & Potholes",
    severity: "High",
    status: "In Progress",
    image: "",
    location: { lat: 40.7128, lng: -74.006 },
    upvotes: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8", "u9", "u10", "u11", "u12"],
    upvoteCount: 12,
    createdBy: { _id: "user1", name: "Sarah Johnson", email: "sarah@example.com" },
    creator: { name: "Sarah Johnson" },
    createdAt: new Date(now - 5 * day).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Sarah Johnson" },
        note: "Reported after my tire was damaged",
        timestamp: new Date(now - 5 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "City Roads Dept" },
        note: "Inspected and confirmed. Scheduling repair.",
        timestamp: new Date(now - 4 * day).toISOString(),
      },
      {
        status: "Assigned",
        updatedBy: { name: "City Roads Dept" },
        note: "Assigned to maintenance crew B",
        timestamp: new Date(now - 3 * day).toISOString(),
      },
      {
        status: "In Progress",
        updatedBy: { name: "Crew Lead Mike" },
        note: "Repair work started this morning",
        timestamp: new Date(now - 1 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-2",
    title: "Water supply disruption in Riverside District",
    description:
      "Multiple households in the Riverside District have reported intermittent water supply for the past 3 days. Water pressure drops significantly during peak hours (7-9 AM and 5-8 PM). Some homes have had no water for up to 4 hours at a time.",
    category: "Water Supply",
    severity: "High",
    status: "Acknowledged",
    image: "",
    location: { lat: 40.7282, lng: -73.7949 },
    upvotes: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8"],
    upvoteCount: 8,
    createdBy: { _id: "user2", name: "Michael Chen", email: "michael@example.com" },
    creator: { name: "Michael Chen" },
    createdAt: new Date(now - 3 * day).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Michael Chen" },
        note: "No water again this morning",
        timestamp: new Date(now - 3 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "Water Utility" },
        note: "We are investigating the main valve on 5th Ave",
        timestamp: new Date(now - 2 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-3",
    title: "Broken streetlights on Elm Avenue (4 consecutive lights out)",
    description:
      "Four streetlights in a row on Elm Avenue between 3rd and 5th Street are not working. This creates a very dark stretch that feels unsafe to walk through at night. Multiple residents have voiced concern about safety.",
    category: "Electricity",
    severity: "Medium",
    status: "Assigned",
    image: "",
    location: { lat: 40.758, lng: -73.9855 },
    upvotes: ["u1", "u2", "u3", "u4", "u5"],
    upvoteCount: 5,
    createdBy: { _id: "user3", name: "Priya Patel", email: "priya@example.com" },
    creator: { name: "Priya Patel" },
    createdAt: new Date(now - 7 * day).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Priya Patel" },
        timestamp: new Date(now - 7 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "Electrical Dept" },
        timestamp: new Date(now - 6 * day).toISOString(),
      },
      {
        status: "Assigned",
        updatedBy: { name: "Electrical Dept" },
        note: "Assigned to night-shift electrician team",
        timestamp: new Date(now - 4 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-4",
    title: "Overflowing dumpster behind Central Market",
    description:
      "The dumpster behind Central Market on 2nd Street has been overflowing for a week. Trash is spilling onto the sidewalk and attracting pests. The smell is terrible and it is a health hazard for nearby residents.",
    category: "Sanitation",
    severity: "Medium",
    status: "Resolved",
    image: "",
    location: { lat: 40.7484, lng: -73.9967 },
    upvotes: ["u1", "u2", "u3"],
    upvoteCount: 3,
    createdBy: { _id: "user4", name: "David Kim", email: "david@example.com" },
    creator: { name: "David Kim" },
    createdAt: new Date(now - 14 * day).toISOString(),
    resolvedAt: new Date(now - 2 * day).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "David Kim" },
        timestamp: new Date(now - 14 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "Sanitation Dept" },
        timestamp: new Date(now - 13 * day).toISOString(),
      },
      {
        status: "In Progress",
        updatedBy: { name: "Sanitation Dept" },
        note: "Extra pickup scheduled",
        timestamp: new Date(now - 5 * day).toISOString(),
      },
      {
        status: "Resolved",
        updatedBy: { name: "Sanitation Dept" },
        note: "Dumpster replaced with a larger unit. Weekly pickup added.",
        timestamp: new Date(now - 2 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-5",
    title: "Illegal dumping near Greenfield Park entrance",
    description:
      "Someone has been dumping construction debris (concrete, rebar, wood) at the east entrance of Greenfield Park. It blocks part of the walking path and is dangerous for children who play in the area.",
    category: "Sanitation",
    severity: "High",
    status: "Submitted",
    image: "",
    location: { lat: 40.6892, lng: -74.0445 },
    upvotes: ["u1", "u2", "u3", "u4", "u5", "u6"],
    upvoteCount: 6,
    createdBy: { _id: "user5", name: "Lisa Martinez", email: "lisa@example.com" },
    creator: { name: "Lisa Martinez" },
    createdAt: new Date(now - 1 * day).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Lisa Martinez" },
        note: "Found this morning during my walk",
        timestamp: new Date(now - 1 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-6",
    title: "Playground equipment broken at Sunset Park",
    description:
      "The main swing set at Sunset Park has a broken chain on one of the swings, and the slide has a crack running along the side. Kids could get hurt. The rubber matting underneath is also worn thin.",
    category: "Parks & Recreation",
    severity: "Medium",
    status: "In Progress",
    image: "",
    location: { lat: 40.7549, lng: -73.984 },
    upvotes: ["u1", "u2", "u3", "u4"],
    upvoteCount: 4,
    createdBy: { _id: "user6", name: "James Wilson", email: "james@example.com" },
    creator: { name: "James Wilson" },
    createdAt: new Date(now - 10 * day).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "James Wilson" },
        timestamp: new Date(now - 10 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "Parks Dept" },
        timestamp: new Date(now - 9 * day).toISOString(),
      },
      {
        status: "In Progress",
        updatedBy: { name: "Parks Dept" },
        note: "Replacement parts ordered",
        timestamp: new Date(now - 3 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-7",
    title: "Noise complaints from late-night construction on 7th Ave",
    description:
      "Construction work on the new building at 7th Ave and Main has been going past 11 PM for the last two weeks. The noise ordinance says work must stop at 9 PM in residential areas. Residents cannot sleep.",
    category: "Noise Complaint",
    severity: "Low",
    status: "Acknowledged",
    image: "",
    location: { lat: 40.7309, lng: -73.9872 },
    upvotes: ["u1", "u2"],
    upvoteCount: 2,
    createdBy: { _id: "user7", name: "Emily Thompson", email: "emily@example.com" },
    creator: { name: "Emily Thompson" },
    createdAt: new Date(now - 2 * day).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Emily Thompson" },
        timestamp: new Date(now - 2 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "Code Enforcement" },
        note: "Inspector scheduled for tonight",
        timestamp: new Date(now - 1 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-8",
    title: "Unauthorized building extension at 45 Maple Drive",
    description:
      "The property at 45 Maple Drive appears to have built a second-story extension without any visible permits posted. It is encroaching on the setback and may violate zoning regulations for the residential zone.",
    category: "Building & Zoning",
    severity: "Low",
    status: "Verified",
    image: "",
    location: { lat: 40.7061, lng: -74.0087 },
    upvotes: ["u1"],
    upvoteCount: 1,
    createdBy: { _id: "user8", name: "Robert Garcia", email: "robert@example.com" },
    creator: { name: "Robert Garcia" },
    createdAt: new Date(now - 20 * day).toISOString(),
    resolvedAt: new Date(now - 5 * day).toISOString(),
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Robert Garcia" },
        timestamp: new Date(now - 20 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "Building Dept" },
        timestamp: new Date(now - 18 * day).toISOString(),
      },
      {
        status: "Assigned",
        updatedBy: { name: "Building Dept" },
        note: "Inspector assigned",
        timestamp: new Date(now - 15 * day).toISOString(),
      },
      {
        status: "Resolved",
        updatedBy: { name: "Building Dept" },
        note: "Violation notice issued. Owner given 30 days to comply.",
        timestamp: new Date(now - 7 * day).toISOString(),
      },
      {
        status: "Verified",
        updatedBy: { name: "Building Dept" },
        note: "Owner submitted proper permit application. Construction paused pending review.",
        timestamp: new Date(now - 5 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-9",
    title: "Suspected gas leak smell near Pine Street junction",
    description:
      "Multiple people have noticed a strong natural gas smell at the Pine Street and 4th Ave junction, especially in the morning. This could be a serious safety hazard and needs immediate investigation.",
    category: "Public Safety",
    severity: "High",
    status: "In Progress",
    image: "",
    location: { lat: 40.742, lng: -73.989 },
    upvotes: ["u1", "u2", "u3", "u4", "u5", "u6", "u7", "u8", "u9", "u10"],
    upvoteCount: 10,
    createdBy: { _id: "user9", name: "Anna Lee", email: "anna@example.com" },
    creator: { name: "Anna Lee" },
    createdAt: new Date(now - 2 * day).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Anna Lee" },
        note: "Very strong smell, please investigate ASAP",
        timestamp: new Date(now - 2 * day).toISOString(),
      },
      {
        status: "Acknowledged",
        updatedBy: { name: "Emergency Services" },
        note: "Gas utility notified immediately",
        timestamp: new Date(now - 2 * day + 2 * hour).toISOString(),
      },
      {
        status: "In Progress",
        updatedBy: { name: "Gas Utility" },
        note: "Crew on-site. Leak detected in underground main. Area cordoned off.",
        timestamp: new Date(now - 1 * day).toISOString(),
      },
    ],
  },
  {
    _id: "mock-10",
    title: "Flooding on Birch Road after every rain",
    description:
      "Birch Road between 10th and 12th street floods badly every time it rains. The storm drains appear to be clogged or undersized. Water levels reach almost a foot deep, making the road impassable.",
    category: "Water Supply",
    severity: "Medium",
    status: "Submitted",
    image: "",
    location: { lat: 40.695, lng: -73.995 },
    upvotes: ["u1", "u2", "u3", "u4", "u5", "u6", "u7"],
    upvoteCount: 7,
    createdBy: { _id: "user10", name: "Tom Harris", email: "tom@example.com" },
    creator: { name: "Tom Harris" },
    createdAt: new Date(now - 6 * hour).toISOString(),
    resolvedAt: undefined,
    statusHistory: [
      {
        status: "Submitted",
        updatedBy: { name: "Tom Harris" },
        note: "Happened again today during light rain",
        timestamp: new Date(now - 6 * hour).toISOString(),
      },
    ],
  },
];

export function getMockAnalytics() {
  const issues = MOCK_ISSUES;
  const resolved = issues.filter(
    (i) => i.status === "Resolved" || i.status === "Verified"
  );
  const open = issues.filter(
    (i) => !["Resolved", "Verified"].includes(i.status)
  );

  const categoryMap: Record<string, number> = {};
  const statusMap: Record<string, number> = {};
  const severityMap: Record<string, number> = {};

  issues.forEach((i) => {
    categoryMap[i.category] = (categoryMap[i.category] || 0) + 1;
    statusMap[i.status] = (statusMap[i.status] || 0) + 1;
    severityMap[i.severity] = (severityMap[i.severity] || 0) + 1;
  });

  const now = Date.now();
  const day = 86400000;
  const issuesOverTime = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(now - (13 - i) * day);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const count = issues.filter((issue) => {
      const created = new Date(issue.createdAt).getTime();
      return (
        created >= date.getTime() - day / 2 && created < date.getTime() + day / 2
      );
    }).length;
    return { date: dateStr, count };
  });

  const trending = [...issues].sort(
    (a, b) => b.upvoteCount - a.upvoteCount
  )[0];

  const mostCommonCategory = Object.entries(categoryMap).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "N/A";

  return {
    totalIssues: issues.length,
    openIssues: open.length,
    resolvedIssues: resolved.length,
    avgResolutionHours: 72,
    mostCommonCategory,
    trendingIssue: trending
      ? {
          _id: trending._id,
          title: trending.title,
          upvoteCount: trending.upvoteCount,
          status: trending.status,
        }
      : null,
    statusDistribution: Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    })),
    categoryDistribution: Object.entries(categoryMap).map(
      ([category, count]) => ({ category, count })
    ),
    severityDistribution: Object.entries(severityMap).map(
      ([severity, count]) => ({ severity, count })
    ),
    issuesOverTime,
  };
}
