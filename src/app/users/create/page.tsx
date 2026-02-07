"use client";

import UserForm from "@/components/users/UserForm";
import { useRouter } from "next/navigation";
import styles from "@/styles/users.module.css";
import { useEffect } from "react";

export default function CreateUserPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "subcontractor") {
      // Redirect to home or dashboard
      router.replace("/"); 
    }
  }, [router]);

  const handleSave = (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    console.log("Saved user:", data);
    router.push("/users"); 
  };
  return (
    <div>
      <h1 className={styles.title}>Create New User</h1>
      <p className={styles.subheading}>Fill out the form below to add a new user.</p>
      <UserForm onSave={handleSave} />
    </div>
  );
}

