"use client";

import { useState } from "react";
import styles from "./InspectionDetail.module.css";

interface Props {
  questionId: number;
  onClose: () => void;
  onSave: (action: {
    questionId: number;
    title: string;
    assignee: string;
    dueDate: string;
  }) => void;
}

export default function RaiseActionModal({ questionId, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSave = () => {
    if (!title || !assignee || !dueDate) {
      alert("Please fill all fields");
      return;
    }
    onSave({ questionId, title, assignee, dueDate });
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>Raise Action</h3>

        <label>Action Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Assign To (Subcontractor)</label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} className={styles.saveBtn}>Save Action</button>
        </div>
      </div>
    </div>
  );
}
