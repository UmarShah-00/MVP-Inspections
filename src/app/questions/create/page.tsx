"use client";

import { useState, useEffect } from "react";
import QuestionForm from "@/components/questions/QuestionForm";
import styles from "@/styles/Question.module.css";

export default function QuestionsFormPage() {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data.categories.map((c: any) => ({ id: c._id, name: c.name })));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = (data: { categoryId: string; text: string }) => {
        console.log("Saved question:", data);
        alert("Question saved!");
    };

    return (
        <div>
            <div className={styles.main}>
                <div>
                    <h1 className={styles.title}>Create Question</h1>
                    <span className={styles.subTitle}>Fill out the form below to add a new question</span>
                </div>
            </div>
            <QuestionForm categories={categories} onSave={handleSave} />
        </div>
    );
}
