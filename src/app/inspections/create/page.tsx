"use client";

import styles from "./CreateInspection.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateInspectionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    type: "",
    date: "",
    subcontractor: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inspection Created:", form);
    router.push("/inspections");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Inspection</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* First Row: Title + Type */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Inspection Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Site Safety Inspection"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Inspection Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="site">Site</option>
              <option value="activity">Activity</option>
              <option value="asset">Asset</option>
            </select>
          </div>
        </div>

        {/* Second Row: Date + Subcontractor */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Inspection Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Subcontractor</label>
            <select
              name="subcontractor"
              value={form.subcontractor}
              onChange={handleChange}
            >
              <option value="">Select Subcontractor</option>
              <option value="abc">ABC Construction</option>
              <option value="xyz">XYZ Electrical</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className={styles.formGroup}>
          <label>Inspection Notes</label>
          <textarea
            name="description"
            placeholder="Any observations or notes"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button type="submit" className={styles.primary}>
            Create Inspection
          </button>
        </div>
      </form>
    </div>
  );
}
