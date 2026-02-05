"use client";

import styles from "./Question.module.css";

interface Question {
  id: number;
  categoryName: string;
  text: string;
}

interface Props {
  questions: Question[];
  onEdit?: (q: Question) => void;
  onDelete?: (id: number) => void;
}

export default function QuestionList({ questions, onEdit, onDelete }: Props) {
  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <span>ID</span>
        <span>Category</span>
        <span>Question</span>
        <span>Actions</span>
      </div>

      {questions.map((q) => (
        <div key={q.id} className={styles.row}>
          <span>{q.id}</span>
          <span>{q.categoryName}</span>
          <span>{q.text}</span>
          <span>
            <button className={styles.editBtn} onClick={() => onEdit?.(q)}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => onDelete?.(q.id)}>Delete</button>
          </span>
        </div>
      ))}
    </div>
  );
}
