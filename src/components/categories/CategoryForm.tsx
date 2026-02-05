"use client";

import { useState } from "react";
import styles from "@/styles/Category.module.css";

interface Props {
  initialData?: { code: string; name: string; description: string };
  onSave: (data: { code: string; name: string; description: string }) => void;
}

export default function CategoryForm({ initialData, onSave }: Props) {
  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return alert("Code and Name are required");
    onSave({ code, name, description });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Category Code *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.inputField}
            placeholder="e.g. SITE"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Category Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
            placeholder="e.g. Site"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${styles.inputField} ${styles.textareaField}`}
            placeholder="Optional description"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={() => alert("Cancelled")}>
          Cancel
        </button>
        <button type="submit" className={styles.primary}>
          Save Category
        </button>
      </div>
    </form>
  );
}
