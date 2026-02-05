"use client";

import UserForm from "@/components/users/UserForm";
import { useRouter } from "next/navigation";
import styles from "@/styles/users.module.css";


export default function CreateUserPage() {
  const router = useRouter();

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

