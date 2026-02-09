"use client";

import styles from "@/styles/Dashboard.module.css";
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
    let start = 0;
    const end = value;
    if (end === 0) return;

    const duration = 1200;
    const increment = end / (duration / 20);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 20);
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
