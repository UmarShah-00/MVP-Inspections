"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import StatsCard from "@/components/dashboard/StatsCard";
import ActionsChart from "@/components/dashboard/ActionsChart";
import InspectionsChart from "@/components/dashboard/InspectionsChart";
import ActionsTrendChart from "@/components/dashboard/ActionsTrendChart";
import styles from "@/components/dashboard/Dashboard.module.css";

export default function Dashboard() {
  const router = useRouter();

  // Client-side token check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirect to login if not authenticated
    }
  }, [router]);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatsCard title="Total Inspections" value="24" />
        <StatsCard title="Open Actions" value="8" warning />
        <StatsCard title="Closed Actions" value="16" success />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <ActionsChart />
        </div>

        <div className={styles.chartCard}>
          <InspectionsChart />
        </div>

        <div className={styles.chartCard}>
          <ActionsTrendChart />
        </div>
      </div>
    </div>
  );
}
