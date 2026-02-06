"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "@/styles/inspections.module.css";

export interface Action {
  _id?: string;
  questionId: string;
  inspectionId: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Closed";
  evidence: string[];
}

interface Props {
  questionId: string;
  inspectionId: string;
  onClose: () => void;
  onSave: (action: Action) => void;
}

export default function RaiseActionModal({
  questionId,
  inspectionId,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"Open" | "In Progress" | "Closed">("Open");
  const [evidence, setEvidence] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [subcontractors, setSubcontractors] = useState<{ _id: string; name: string }[]>([]);

  // Fetch subcontractors
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchSubcontractors = async () => {
      try {
        const res = await fetch("/api/users?role=Subcontractor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSubcontractors(data.users || []);
      } catch (err) {
        console.error("Failed to fetch subcontractors:", err);
      }
    };

    fetchSubcontractors();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setEvidence(Array.from(e.target.files));
  };

  const handleSave = async () => {
    if (!title || !assignee || !dueDate) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields (*)",
        customClass: { confirmButton: styles.swalConfirmBtn },
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      // Append action info
      formData.append(
        "newActions",
        JSON.stringify([{ questionId, title, assignee, dueDate, status }])
      );
      // Append files with key = questionId
      evidence.forEach((file) => formData.append(questionId, file));

      const token = localStorage.getItem("token");
      const res = await fetch(`/api/inspections/${inspectionId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`, // No Content-Type
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save action");

      onSave(data.savedActions[0]);
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Action saved successfully",
        confirmButtonColor: "#000",
        confirmButtonText: "OK",
        customClass: { confirmButton: styles.swalConfirmBtn },
      });
      onClose();
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        customClass: { confirmButton: styles.swalConfirmBtn },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div style={{ marginBottom: "12px" }}>
          <h3 style={{ margin: 0, textAlign: "left", fontSize: "20px", fontWeight: 600 }}>
            Raise Action
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#555", textAlign: "left" }}>
            Fill in the details below to create a new action for this question.
          </p>
        </div>

        <label>
          Action Title <span className={styles.required}>*</span>
        </label>
        <input type="text" placeholder="Enter action title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>
          Assign To (Subcontractor) <span className={styles.required}>*</span>
        </label>
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option value="">Select a subcontractor</option>
          {subcontractors.map((user) => (
            <option key={user._id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>

        <label>
          Due Date <span className={styles.required}>*</span>
        </label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <label>Evidence / Files</label>
        <input type="file" multiple onChange={handleFileChange} />
        {evidence.length > 0 && (
          <p className={styles.commentNote}>
            Selected Files: {evidence.map((f) => f.name).join(", ")}
          </p>
        )}

        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} className={styles.saveBtn} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
