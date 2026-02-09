"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import styles from "@/styles/category.module.css";

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id;

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Fetch category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/categories/${categoryId}`);
                const data = await res.json();
                if (res.ok) {
                    setCode(data.category.code);
                    setName(data.category.name);
                    setDescription(data.category.description || "");
                } else {
                    Swal.fire({ title: "Error", text: data.error || "Failed to load category", icon: "error" });
                }
            } catch (err) {
                console.error(err);
                Swal.fire({ title: "Error", text: "Something went wrong", icon: "error" });
            } finally {
                setFetching(false);
            }
        };
        fetchCategory();
    }, [categoryId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code || !name) {
            return Swal.fire({
                title: "Error",
                text: "Code and Name are required",
                icon: "error",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000", // Black button
                confirmButtonText: "OK",     // Button text
            });
        }

        try {
            setLoading(true);

            const res = await fetch(`/api/categories/${categoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, name, description }),
            });

            const data = await res.json();

            if (!res.ok) {
                return Swal.fire({
                    title: "Error",
                    text: data.message || "Update failed",
                    icon: "error",
                    background: "#fff",
                    color: "#000",
                    confirmButtonColor: "#000",
                    confirmButtonText: "OK",
                });
            }

            Swal.fire({
                title: "Success",
                text: "Category updated successfully",
                icon: "success",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000",
                confirmButtonText: "OK",
            }).then(() => {
                router.push("/categories");
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error",
                text: "Something went wrong",
                icon: "error",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className={styles.loading}>Loading...</div>;

    return (
        <>
            <div>
                <h1 className={styles.title}>Edit Category</h1>
                <span className={styles.subTitle}>Update the category details below</span>

            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Category Code <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter category code"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Category Name <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter category name"
                        />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            className={`${styles.inputField} ${styles.textareaField}`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.secondary} onClick={() => router.back()} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.primary} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </>
    );
}
