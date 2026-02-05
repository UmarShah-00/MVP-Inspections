"use client";
import styles from "@/styles/Category.module.css";
import Link from "next/link";

interface Category {
  id: number;
  code: string;
  name: string;
  description: string;
}

interface Props {
  categories: Category[];
}

export default function CategoryTable({ categories }: Props) {
  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <span>ID</span>
        <span>Code</span>
        <span>Name</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className={styles.row}>
          <span>{cat.id}</span>
          <span>{cat.code}</span>
          <span>{cat.name}</span>
          <span>{cat.description}</span>
          <span>
            <Link href={`/categories/edit/${cat.id}`} className={styles.editBtn}>
              Edit
            </Link>
          </span>
        </div>
      ))}
    </div>
  );
}
