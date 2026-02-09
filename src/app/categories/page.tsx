"use client";

import { useState, useEffect } from "react";
import CategoryTable from "@/components/categories/CategoryTable";
import Link from "next/link";
import styles from "@/styles/category.module.css";
import { useRouter } from "next/navigation";
interface ICategory {
  _id: string;
  code: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "subcontractor") {
      router.replace("/"); // Redirect to dashboard/home
    }
  }, [router]);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <span className={styles.subTitle}>Manage all your categories efficiently</span>
        </div>
        <div>
          <Link href="/categories/create" className={styles.createBtn}>
            + Add Category
          </Link>
        </div>
      </div>

      <CategoryTable categories={categories} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
