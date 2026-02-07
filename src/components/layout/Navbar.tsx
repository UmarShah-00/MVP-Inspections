"use client";

import styles from "@/styles/Layout.module.css";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        name: payload.name || payload.email,
        email: payload.email,
        role: payload.role,
      });
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null; 

  return (
    <header className={styles.navbar}>
      <div>
        <h3>Single Site – Inspection Platform</h3>
        <span className={styles.role}>{user.role}</span>
      </div>

      <div className={styles.user} ref={menuRef}>
        <span
          className={styles.avatar}
          onClick={() => setOpen(!open)}
          style={{ cursor: "pointer" }}
        >
          {user.name.charAt(0).toUpperCase()}
        </span>

        {open && (
          <div className={styles.dropdown}>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
