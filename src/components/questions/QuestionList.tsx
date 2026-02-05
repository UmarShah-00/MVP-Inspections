"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "@/styles/Question.module.css";

interface Question {
  id: string;
  categoryName: string;
  text: string;
}

interface Props {
  questions: Question[];
  onDelete: (id: string) => void;
}

export default function QuestionList({ questions, onDelete }: Props) {
  if (questions.length === 0)
    return <div className={styles.noRecords}>No questions added yet.</div>;

  const handleDeleteClick = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#ccc",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id); // call the client-side DELETE function
      }
    });
  };

  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <span>#</span>
        <span>Category</span>
        <span>Question</span>
        <span>Actions</span>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className={styles.row}>
          <span>{idx + 1}</span>
          <span>{q.categoryName}</span>
          <span>{q.text}</span>
          <span className={styles.actions}>
            <Link href={`/questions/edit/${q.id}`}>
              <button className={styles.actionBtn}>
                <FaEdit />
              </button>
            </Link>
            <button
              className={styles.actionBtn}
              onClick={() => handleDeleteClick(q.id)}
            >
              <FaTrash />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
