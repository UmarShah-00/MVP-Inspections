"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "@/styles/Question.module.css";

interface Props {
  categories: { id: string; name: string }[];
  initialData?: { categoryId: string; text: string };
  onSave?: (data: { categoryId: string; text: string }) => void;
}

export default function QuestionForm({ categories, initialData, onSave }: Props) {
  const router = useRouter();
  const [text, setText] = useState(initialData?.text || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryId || !text.trim()) {
      return Swal.fire({
        title: "Error",
        text: "Please select a category and enter a question",
        icon: "error",
        confirmButtonColor: "#000",
      });
    }

    setLoading(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save");

      await Swal.fire({
        title: "Success",
        text: "Question saved successfully",
        icon: "success",
        confirmButtonColor: "#000",
      });

      router.push("/questions");

      // Reset form
      setText("");
      setCategoryId(categories[0]?.id || "");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={styles.selectField}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="questionText">Question Text</label>
        <textarea
          id="questionText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.textareaField}
          placeholder="Enter your question"
        />
      </div>

      <div className={styles.action}>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className={styles.primary} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
