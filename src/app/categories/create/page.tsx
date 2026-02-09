"use client";

import CategoryForm from "@/components/categories/CategoryForm";
import { useRouter } from "next/navigation";
import styles from "@/styles/category.module.css";
import Swal from "sweetalert2";
import { useEffect } from "react";
export default function CreateCategoryPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase();
    if (role === "subcontractor") {
      router.replace("/"); // Redirect to home/dashboard
    }
  }, [router]);

  const handleSave = async (data: { code: string; name: string; description: string }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        return Swal.fire({
          icon: "error",
          title: "Oops!",
          text: result.message,
          confirmButtonColor: "#000",
          confirmButtonText: "OK",
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Category saved successfully",
        confirmButtonColor: "#000",
        confirmButtonText: "OK",
      });

      router.push("/categories");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#000",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div>
      <h1 className={styles.title}>Create Category</h1>
      <span className={styles.subTitle}>Add a new category to organize your items</span>
      <CategoryForm onSave={handleSave} />
    </div>
  );
}
