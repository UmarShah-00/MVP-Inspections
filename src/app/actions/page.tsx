"use client";

import { useState } from "react";
import styles from "./actions.module.css";

// Dummy Actions State (in real app API se aayega)
const initialActions = [
  {
    id: 1,
    inspectionId: 1,
    questionId: 2,
    title: "Ensure PPE worn",
    assignee: "Subcontractor ABC",
    dueDate: "2026-02-10",
    status: "Open",
  },
  {
    id: 2,
    inspectionId: 1,
    questionId: 3,
    title: "Check tools condition",
    assignee: "Subcontractor XYZ",
    dueDate: "2026-02-12",
    status: "In Progress",
  },
];

export default function ActionsPage() {
  const [actions, setActions] = useState(initialActions);

  const handleStatusChange = (id: number, newStatus: string) => {
    const updated = actions.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setActions(updated);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Actions</h1>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>ID</span>
          <span>Title</span>
          <span>Inspection ID</span>
          <span>Assignee</span>
          <span>Due Date</span>
          <span>Status</span>
        </div>

        {actions.map((a) => (
          <div key={a.id} className={styles.row}>
            <span>{a.id}</span>
            <span>{a.title}</span>
            <span>{a.inspectionId}</span>
            <span>{a.assignee}</span>
            <span>{a.dueDate}</span>
            <span>
              <select
                value={a.status}
                onChange={(e) => handleStatusChange(a.id, e.target.value)}
                className={styles.statusSelect}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
