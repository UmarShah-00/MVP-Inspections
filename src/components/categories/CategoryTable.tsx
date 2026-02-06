"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "@/styles/users.module.css";

interface ICategory {
  _id: string;
  code: string;
  name: string;
  description?: string;
}

interface Props {
  categories: ICategory[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ categories, loading, onDelete }: Props) {
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (categories.length === 0) return <div className={styles.noRecords}>No categories added yet.</div>;

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#000",
      confirmButtonColor: "#000", // black confirm button
      cancelButtonColor: "#ccc",  // grey cancel button
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id); // call parent delete handler
        Swal.fire({
          title: "Deleted!",
          text: "Category has been deleted.",
          icon: "success",
          background: "#fff",
          color: "#000",
          confirmButtonColor: "#000",
          confirmButtonText: "OK",
        });
      }
    });
  };

  return (
    <div className={styles.table}>
      {/* Table Header */}
      <div className={`${styles.row} ${styles.header}`}>
        <span>#</span>
        <span>Code</span>
        <span>Name</span>
        <span>Actions</span>
      </div>

      {/* Table Rows */}
      {categories.map((cat, idx) => (
        <div key={cat._id} className={styles.row}>
          <span>{idx + 1}</span>
          <span>{cat.code}</span>
          <span>{cat.name}</span>
          <span className={styles.actions}>
            <Link href={`/categories/edit/${cat._id}`}>
              <button className={styles.actionBtn}>
                <FaEdit />
              </button>
            </Link>
            <button
              className={styles.actionBtn}
              onClick={() => handleDelete(cat._id)}
            >
              <FaTrash />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
