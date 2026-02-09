"use client";

import { useEffect, useState } from "react";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type Action = {
  status: string;
  [key: string]: any;
};

type ActionStatus = { name: string; actions: number };
type CategoryData = { name: string; value: number };

export const useDashboard = () => {
  const [stats, setStats] = useState<{ totalInspections: number; openActions: number; closedActions: number } | null>(null);
  const [actionsStatus, setActionsStatus] = useState<ActionStatus[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [category, setCategory] = useState<CategoryData[]>([]);
  const [recentInspections, setRecentInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchJSON = async (url: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actionsRes, trendRes, categoryRes, recentRes] = await Promise.all([
          fetchJSON("/api/dashboard/stats"),
          fetchJSON("/api/actions"),
          fetchJSON("/api/dashboard/actions-trend"),
          fetchJSON("/api/dashboard/inspection-category"),
          fetchJSON("/api/dashboard/recent-inspections"),
        ]);

        // === Stats Cards ===
        setStats({
          totalInspections: statsRes.totalInspections || 0,
          openActions: statsRes.openActions || 0,
          closedActions: statsRes.closedActions || 0,
        });

        // === Actions Bar Chart ===
        const actions: Action[] = actionsRes.actions || [];
        const openCount = actions.filter((a) => a.status === "Open").length;
        const inProgressCount = actions.filter((a) => a.status === "In Progress").length;
        const closedCount = actions.filter((a) => a.status === "Closed").length;

        setActionsStatus([
          { name: "Open", actions: openCount },
          { name: "In Progress", actions: inProgressCount },
          { name: "Closed", actions: closedCount },
        ]);

        // === Actions Trend Chart ===
        const grouped: Record<string, any> = {};
        (trendRes || []).forEach((d: any) => {
          const month = months[d._id.month - 1] || "Unknown";
          if (!grouped[month]) grouped[month] = { month, Open: 0, "In Progress": 0, Closed: 0 };

          let status = (d._id.status || "").trim();
          if (status === "Draft") status = "Open";
          else if (status === "Submitted") status = "Closed";

          if (["Open", "In Progress", "Closed"].includes(status)) grouped[month][status] += d.count;
        });
        setTrend(Object.values(grouped));

        // === Inspections PieChart ===
        type CategoryResItem = { name?: string; value?: number };

        const mappedCategory = (categoryRes as CategoryResItem[] || [])
          .map((c) => ({ name: c.name || "N/A", value: c.value || 0 }))
          .filter((c) => c.value > 0);

        setCategory(mappedCategory);

        // === Recent Inspections ===
        setRecentInspections(recentRes || []);

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
