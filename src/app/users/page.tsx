"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import styles from "@/styles/users.module.css";
import UsersTable from "@/components/users/UsersTable";

interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "Main Contractor" | "Subcontractor" | "Default";
}

export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const MySwal = withReactContent(Swal);

    // Fetch all users
    useEffect(() => {
        let isMounted = true; // Add flag

        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/auth/userList");
                const data = await res.json();
                if (!isMounted) return; // Stop if unmounted
                setUsers(data.users || []);
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUsers();

        return () => {
            isMounted = false; // Cleanup
        };
    }, []);

    // Handle delete
    const handleDelete = async (id: string, role: string) => {
        if (role === "Main Contractor") return;

        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            background: "#fff",
            color: "#000",
            confirmButtonColor: "#000",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete user");

            setUsers((prev) => prev.filter((u) => u._id !== id));

            MySwal.fire({
                title: "Success",
                text: "User deleted successfully!",
                icon: "success",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000",
            });
        } catch (err) {
            console.error(err);
            MySwal.fire({
                title: "Error",
                text: "Something went wrong!",
                icon: "error",
                background: "#fff",
                color: "#000",
                confirmButtonColor: "#000",
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>
                    <h1 className={styles.title}>Users</h1>
                    <p className={styles.subTitle}>Manage all users, their roles, and actions</p>
                </div>

                <Link href="/users/create" className={styles.createButton}>
                    + Add User
                </Link>
            </div>

            <div className={styles.table}>
                <div className={styles.header}>
                    <span>#</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Action</span>
                </div>

                <UsersTable users={users} loading={loading} onDelete={handleDelete} />
            </div>
        </div>
    );
}
