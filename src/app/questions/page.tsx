"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import QuestionList from "@/components/questions/QuestionList";
import { useRouter } from "next/navigation";
import styles from "@/styles/Question.module.css";

interface Question {
  id: string;
  categoryName: string;
  text: string;
}

export default function QuestionsTablePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Block subcontractor from accessing page
  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "subcontractor") {
      router.replace("/"); // Redirect to home/dashboard
    }
  }, [router]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/questions", {
        headers: { Authorization: `Bearer ${token}` }, // token protected
      });
      const data = await res.json();

      const mappedQuestions = (data.questions || []).map((q: any) => ({
        id: q._id,
        categoryName: q.categoryId?.name || "Unknown",
        text: q.text,
      }));

      setQuestions(mappedQuestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }, // token protected
      });
      if (!res.ok) throw new Error("Failed to delete question");

      setQuestions((prev) => prev.filter((q) => q.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "Question has been deleted.",
        icon: "success",
        confirmButtonColor: "#000",
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  return (
    <div>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Questions</h1>
          <span className={styles.subTitle}>
            Manage all your questions with category info
          </span>
        </div>
        <div>
          <Link href="/questions/create" className={styles.createBtn}>
            + Add Question
          </Link>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading questions...</div>
      ) : (
        <QuestionList questions={questions} onDelete={handleDelete} />
      )}
    </div>
  );
}
