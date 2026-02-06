"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "@/styles/actions.module.css";

interface Action {
  number: number;
  _id: string;
  title: string;
  inspectionTitle: string;
  createdByName: string;
  createdByRole: string;
  assignee: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Closed";
  evidence: string[]; // paths to public/uploads
}

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const fetchActions = async () => {
    try {
      const res = await fetch("/api/actions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch actions");
      setActions(data.actions || []);
    } catch (err: any) {
      console.error(err);
      Swal.fire({ title: "Error", text: err.message, icon: "error" });
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActions((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: newStatus as any } : a))
    );

    try {
      const res = await fetch("/api/actions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId: id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: `Status updated to "${newStatus}"`,
        confirmButtonColor: "#000",
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      Swal.fire({ title: "Error", text: err.message, icon: "error" });
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Actions</h1>
        <span className={styles.subTitle}>Manage all your Actions efficiently</span>
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          <span>#</span>
          <span>Title</span>
          <span>Inspection</span>
          <span>Created By</span>
          <span>Due Date</span>
          <span>Status</span>
          <span>Evidence</span>
        </div>

        {actions.map((a) => (
          <div key={a._id} className={styles.row}>
            <span>{a.number}</span>
            <span>{a.title}</span>
            <span>{a.inspectionTitle}</span>
            <span>
              {a.createdByName}
              <br />
              <small style={{ fontSize: "10px", color: "#555" }}>{a.createdByRole}</small>
            </span>
            <span>{a.dueDate}</span>
            <span>
              <select
                value={a.status}
                onChange={(e) => handleStatusChange(a._id, e.target.value)}
                className={styles.statusSelect}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </span>
            <span>
              {a.evidence.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="evidence"
                  style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "4px", cursor: "pointer" }}
                  onClick={() => setPreviewImg(img)} // click se open
                />
              ))}
            </span>
          </div>
        ))}
        {previewImg && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              cursor: "pointer",
            }}
            onClick={() => setPreviewImg(null)} // click anywhere close
          >
            <img
              src={previewImg}
              alt="Preview"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "8px",
                boxShadow: "0 0 10px #000",
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
