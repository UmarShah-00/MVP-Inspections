"use client";

import { useState } from "react";
import CategoryTable from "@/components/categories/CategoryTable";
import Link from "next/link";
import styles from "@/styles/Category.module.css";



export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, code: "SITE", name: "Site", description: "Site-related inspections" },
    { id: 2, code: "ACT", name: "Activity", description: "Activity-related inspections" },
    { id: 3, code: "AST", name: "Asset", description: "Asset-related inspections" },
  ]);

  return (
    <div>
        <div className={styles.main}>
      <h1 className={styles.title}>Categories</h1>
      <Link href="/categories/create" className={styles.createBtn}>+ Add Category</Link>

    </div>
      <CategoryTable categories={categories} />
    </div>
  );
}
