"use client";

import { useState } from "react";
import styles from "@/styles/category.module.css";
import Swal from "sweetalert2";

interface Props {
  initialData?: { code: string; name: string; description: string };
  onSave: (data: { code: string; name: string; description: string }) => void;
}

export default function CategoryForm({ initialData, onSave }: Props) {
  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !name) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Code and Name are required!",
        confirmButtonColor: "#000",
      });
    }

    try {
      setLoading(true);

      await onSave({ code, name, description });

      setCode("");
      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Category Code <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.inputField}
            placeholder="e.g. SITE"
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Category Name <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
            placeholder="e.g. Site"
            disabled={loading}
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
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.action}>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className={styles.primary} disabled={loading}>
          {loading ? "Saving..." : "Save "}
        </button>
      </div>
    </form>
  );
}
