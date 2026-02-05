"use client";

import CategoryForm from "@/components/categories/CategoryForm";
import { useRouter } from "next/navigation";
import styles from "@/styles/Category.module.css";


export default function CreateCategoryPage() {
  const router = useRouter();

  const handleSave = (data: { code: string; name: string; description: string }) => {
    console.log("Saved category:", data);
    alert("Category saved!");
    router.push("/categories");
  };

  return (
    <div>
      <h1 className={styles.title}>Create Category</h1>
      <CategoryForm onSave={handleSave} />
    </div>
  );
}
