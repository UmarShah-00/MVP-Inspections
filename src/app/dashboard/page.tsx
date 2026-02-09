"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";

import StatsCard from "@/components/dashboard/StatsCard";
import ActionsChart from "@/components/dashboard/ActionsChart";
import InspectionsChart from "@/components/dashboard/InspectionsChart";
import ActionsTrendChart from "@/components/dashboard/ActionsTrendChart";
import RecentInspectionsTable from "@/components/dashboard/RecentInspectionsTable";

import styles from "@/styles/dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const { stats, actionsStatus, trend, category, recentInspections, loading } = useDashboard();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subTitle}>Overview of inspections, actions, and trends</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard title="Total Inspections" value={stats?.totalInspections || 0} icon="clipboard" />
        <StatsCard title="Open Actions" value={stats?.openActions || 0} icon="alert-circle" variant="warning" />
        <StatsCard title="Closed Actions" value={stats?.closedActions || 0} icon="check-circle" variant="success" />
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}><ActionsChart data={actionsStatus} /></div>
        <div className={styles.chartCard}><InspectionsChart data={category} /></div>
        <div className={styles.chartCard}><ActionsTrendChart data={trend} /></div>
      </div>

      {/* Recent Inspections */}
      <div style={{ marginTop: 40 }}>
        <h2 className={styles.title}>Recent Inspections</h2>
        <RecentInspectionsTable data={recentInspections} />
      </div>
    </div>
  );
}
