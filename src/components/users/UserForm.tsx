"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "@/styles/users.module.css";


interface Props {
    initialData?: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: string;
    };
    onSave?: (data: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: string;
    }) => void;
}

export default function UserForm({ initialData, onSave }: Props) {
    const router = useRouter();

    const [name, setName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [password, setPassword] = useState(initialData?.password || "");
    const [confirmPassword, setConfirmPassword] = useState(initialData?.confirmPassword || "");
    const [role, setRole] = useState(initialData?.role || "Selected");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password || !confirmPassword || role === "Selected") {
            return Swal.fire({
                title: "Error",
                text: "All fields are required and role must be selected!",
                icon: "error",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000",
            });
        }

        if (password !== confirmPassword) {
            return Swal.fire({
                title: "Error",
                text: "Passwords do not match!",
                icon: "error",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000",
            });
        }

        if (onSave) {
            onSave({ name, email, password, confirmPassword, role });
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            const result = await res.json();

            if (!res.ok) {
                return Swal.fire({
                    title: "Error",
                    text: result.error || "Failed to create user",
                    icon: "error",
                    background: "#fff",
                    color: "#000",
                    confirmButtonColor: "#000",
                });
            }

            Swal.fire({
                title: "Success",
                text: "User created successfully!",
                icon: "success",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000",
            });

            // Reset form
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setRole("Selected");

            router.push("/users");
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error",
                background: "#fff",
                color: "#000",
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
                    <label>Name <span className={styles.required}>*</span></label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputField}
                        placeholder="Enter full name"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Email <span className={styles.required}>*</span></label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputField}
                        placeholder="Enter email"
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Password <span className={styles.required}>*</span></label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.inputField}
                        placeholder="Enter password"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Confirm Password <span className={styles.required}>*</span></label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.inputField}
                        placeholder="Confirm password"
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Role <span className={styles.required}>*</span></label>
                    <select
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={styles.inputField}
                    >
                        <option value="Selected">Select Role</option>
                        <option value="Main Contractor">Main Contractor</option>
                        <option value="Subcontractor">Subcontractor</option>
                    </select>
                </div>
            </div>

            <div className={styles.actions}>
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
