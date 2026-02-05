"use client";

import { useState } from "react";
import styles from "./Question.module.css";

interface Props {
  categories: { id: number; name: string }[];
  initialData?: { categoryId: number; text: string };
  onSave: (data: { categoryId: number; text: string }) => void;
}

export default function QuestionForm({ categories, initialData, onSave }: Props) {
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || 0);
  const [text, setText] = useState(initialData?.text || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return alert("Question text is required");
    onSave({ categoryId, text });
    setText("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Add Question</h2>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className={styles.selectField}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Question Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.textareaField}
            placeholder="Enter question"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.primary}>Save Question</button>
      </div>
    </form>
  );
}
