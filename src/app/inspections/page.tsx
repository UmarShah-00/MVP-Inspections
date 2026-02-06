"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/inspections.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";

interface UserInfo {
  name: string;
  role: string;
}

interface Inspection {
  _id: string;
  title: string;
  date: string;
  createdBy: UserInfo;
  assignedJS: UserInfo;
  findings: string;
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    async function fetchInspections() {
      try {
        const res = await fetch("/api/inspections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setInspections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch inspections:", err);
      }
    }

    fetchInspections();
  }, [token]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Inspections</h1>
          <span className={styles.subTitle}>Manage all your inspections efficiently</span>
        </div>
        <div>
          <Link href="/inspections/create" className={styles.createBtn}>
            + Add Inspection
          </Link>
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>#</span>
          <span>Title</span>
          <span>Date</span>
          <span>Created By</span>
          <span>Assigned To</span>
          <span>Findings</span>
          <span>Action</span>

        </div>

        {inspections.map((item, idx) => (
          <Link key={item._id} href={`/inspections/${item._id}`} className={styles.row}>
            <span>{idx + 1}</span>

            {/* Title */}
            <span>{item.title}</span>

            {/* Date as badge */}
            <span>
              <span className={styles.badge}>{formatDate(item.date)}</span>
            </span>

            {/* Created By */}
            <span>
              {item.createdBy?.name || "Unknown"}
              <br />
              <small className={styles.smallText}>{item.createdBy?.role || "N/A"}</small>
            </span>

            {/* Assigned JS */}
            <span>
              {item.assignedJS?.name || "Unassigned"}
              <br />
              <small className={styles.smallText}>{item.assignedJS?.role || "N/A"}</small>
            </span>

            {/* Findings */}
            <span>{item.findings || "N/A"}</span>

          <span className={styles.actions}>
                      <Link href={"/categories/edit"}>
                        <button className={styles.actionBtns}>
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        className={styles.actionBtns}
                      >
                        <FaTrash />
                      </button>
                    </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
