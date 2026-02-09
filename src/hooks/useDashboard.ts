"use client";

import { useEffect, useState } from "react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const useDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [actionsStatus, setActionsStatus] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [recentInspections, setRecentInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchJSON = async (url: string) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actionsRes, trendRes, categoryRes, recentRes] =
          await Promise.all([
            fetchJSON("/api/dashboard/stats"),
            fetchJSON("/api/actions"),
            fetchJSON("/api/dashboard/actions-trend"),
            fetchJSON("/api/dashboard/inspection-category"),
            fetchJSON("/api/dashboard/recent-inspections"),
          ]);

        setStats(statsRes);
        setRecentInspections(recentRes || []);

        // Actions Status (BarChart)
        const statusMap: Record<string, string> = {
          Draft: "Open",
          "In Progress": "In Progress",
          Submitted: "Closed",
          Closed: "Closed",
        };
        const statusCounts = ["Open", "In Progress", "Closed"].map(
          (status) => ({
            name: status,
            actions: (actionsRes.actions || []).filter((a: any) => {
              const s = (a.status || "").trim(); // remove spaces
              const mapped = statusMap[s] || s; // fallback to itself
              return mapped === status;
            }).length,
          }),
        );

        setActionsStatus(statusCounts);

        // Actions Trend (LineChart)
        const grouped: Record<string, any> = {};
        (trendRes || []).forEach((d: any) => {
          const month = months[d._id.month - 1] || "Unknown";
          if (!grouped[month])
            grouped[month] = { month, Open: 0, "In Progress": 0, Closed: 0 };
          const chartStatus = statusMap[d._id.status];
          if (chartStatus) grouped[month][chartStatus] += d.count;
        });
        setTrend(Object.values(grouped));

        // Inspections by Category (PieChart)
        const mappedCategory = (categoryRes || [])
          .map((c: any) => ({ name: c.name || "N/A", value: c.value || 0 }))
          .filter((c) => c.value > 0);
        setCategory(mappedCategory);

        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, actionsStatus, trend, category, recentInspections, loading };
};
