"use client";

import Link from "next/link";
import styles from "./inspections.module.css";
import { inspections } from "@/data/inspections";
import { actions } from "@/data/actions"; // imported actions to calculate findings

export default function InspectionsPage() {
  return (
    <div>
      <h1 className={styles.title}>Inspections</h1>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>ID</span>
          <span>Title</span>
          <span>Date</span>
          <span>Created By</span>
          <span>Findings</span>
        </div>

        {inspections.map((item) => {
          const findings = actions.filter(a => a.inspectionId === item.id).length;

          return (
            <Link
              key={item.id}
              href={`/inspections/${item.id}`}
              className={styles.row}
            >
              <span>{item.id}</span>
              <span>{item.title}</span>
              <span>{item.date}</span>
              <span>{item.createdBy}</span>
              <span>{findings}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
