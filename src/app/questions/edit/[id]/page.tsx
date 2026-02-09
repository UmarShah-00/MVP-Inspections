"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import styles from "@/styles/question.module.css";

interface Category {
    id: string;
    name: string;
}

interface QuestionData {
    id: string;
    categoryId: string;
    categoryName: string;
    text: string;
}

export default function EditQuestionPage() {
    const router = useRouter();
    const params = useParams(); // gets [id] from route
    const questionId = params.id;

    const [categories, setCategories] = useState<Category[]>([]);
    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [categoryId, setCategoryId] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    // fetch categories + question
    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch categories
                const catRes = await fetch("/api/categories");
                const catData = await catRes.json();
                setCategories(catData.categories.map((c: any) => ({ id: c._id, name: c.name })));

                // fetch question
                const qRes = await fetch(`/api/questions/${questionId}`);
                const qData = await qRes.json();
                setQuestion(qData.question);
                setCategoryId(qData.question.categoryId._id); // set selected category
                setText(qData.question.text);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [questionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId || !text) {
            return Swal.fire({ title: "Error", text: "Category and question are required", icon: "error", confirmButtonColor: "#000" });
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/questions/${questionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoryId, text }),
            });
            const data = await res.json();

            if (!res.ok) {
                return Swal.fire({ title: "Error", text: data.error || "Update failed", icon: "error", confirmButtonColor: "#000" });
            }

            Swal.fire({ title: "Success", text: "Question updated successfully", icon: "success", confirmButtonColor: "#000" })
                .then(() => router.push("/questions"));
        } catch (err) {
            console.error(err);
            Swal.fire({ title: "Error", text: "Something went wrong", icon: "error", confirmButtonColor: "#000" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!question) return <p>Question not found</p>;

    return (
        <>
            <div className={styles.main}>
                <div>
                    <h1 className={styles.title}>Edit Question</h1>
                    <span className={styles.subTitle}>Update the question and select the correct category</span>
                </div>
            </div>
            <div className={styles.form}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={styles.selectField}>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
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

                    <div className={styles.action}>
                        <button type="button" className={styles.secondary} onClick={() => router.back()} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.primary} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
