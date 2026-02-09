"use client";
import styles from "@/styles/dashboard.module.css";
import { FiClipboard, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  value: number;
  icon: string;
  variant?: "warning" | "success";
}

const icons: Record<string, any> = {
  clipboard: FiClipboard,
  "check-circle": FiCheckCircle,
  "alert-circle": FiAlertCircle,
};

export default function StatsCard({ title, value, icon, variant }: Props) {
  const [count, setCount] = useState(0);
  const Icon = icons[icon];

  useEffect(() => {
    if (value === 0) { setCount(0); return; }
    let start = 0;
    const duration = 1200;
    const steps = duration / 20;
    const increment = value / steps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(counter); }
      else setCount(Math.floor(start));
    }, 20);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div className={`${styles.card} ${variant ? styles[variant] : ""}`}>
      <div className={styles.cardTop}>
        {Icon && <Icon size={28} />}
        <p>{title}</p>
      </div>
      <h2>{count}</h2>
    </div>
  );
}
