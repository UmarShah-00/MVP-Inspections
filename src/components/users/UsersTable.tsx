"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "@/styles/users.module.css";

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "Main Contractor" | "Subcontractor" | "Default";
}

interface Props {
    users: IUser[];
    loading: boolean;
    onDelete: (id: string, role: string) => void;
}

export default function UsersTable({ users, loading, onDelete }: Props) {
    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (users.length === 0) return <div className={styles.noRecords}>No questions added yet.</div>;

    const handleDelete = (id: string, role: string) => {
        if (role === "Main Contractor") return;

        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000",
            cancelButtonColor: "#ccc",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) onDelete(id, role);
        });
    };

    return (
        <>
            {users.map((user, idx) => (
                <div key={user._id} className={styles.row}>
                    <span>{idx + 1}</span>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <span>
                        <span
                            className={`${styles.badge} ${user.role === "Main Contractor"
                                    ? styles.main
                                    : user.role === "Subcontractor"
                                        ? styles.sub
                                        : styles.defaultRole
                                }`}
                        >
                            {user.role}
                        </span>
                    </span>
                    <span className={styles.actions}>
                        <Link href={`/users/edit/${user._id}`}>
                            <button className={styles.actionBtn}>
                                <FaEdit />
                            </button>
                        </Link>

                        <button
                            className={styles.actionBtn}
                            disabled={user.role === "Main Contractor"}
                            onClick={() => handleDelete(user._id, user.role)}
                            style={{
                                cursor: user.role === "Main Contractor" ? "not-allowed" : "pointer",
                                opacity: user.role === "Main Contractor" ? 0.5 : 1,
                            }}
                            title={
                                user.role === "Main Contractor"
                                    ? "Cannot delete Main Contractor"
                                    : "Delete User"
                            }
                        >
                            <FaTrash />
                        </button>
                    </span>
                </div>
            ))}
        </>
    );
}
