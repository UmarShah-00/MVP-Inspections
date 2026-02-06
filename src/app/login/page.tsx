"use client";

import { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("role", data.user.role);
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }


  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.heading}>MVP Inspections</h1>
      <p className={styles.description}>
        Login to access your inspections and actions dashboard.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="********"
            required
          />
        </label>

        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>

      <p className={styles.footerText}>
        Forgot your password? <a href="#" className={styles.link}>Reset here</a>
      </p>
    </div>
  );
}
