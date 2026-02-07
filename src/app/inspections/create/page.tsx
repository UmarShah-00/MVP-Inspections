"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/createInspection.module.css";
import Swal from "sweetalert2";

interface Category {
  _id: string;
  name: string;
  code?: string;
  description?: string;
}

interface Subcontractor {
  _id: string;
  name: string;
  email?: string;
}

export default function CreateInspectionPage() {
  const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role?.toLowerCase() === "subcontractor") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not allowed to create inspections",
        confirmButtonColor: "#000",
      }).then(() => {
        router.replace("/inspections");
      });
    }
  }, [router]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    categoryId: "",
    subcontractorId: "",
    description: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        const catRes = await fetch("/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoriesData = await catRes.json();
        setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : []);

        const subRes = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await subRes.json();
        setSubcontractors(Array.isArray(usersData.users) ? usersData.users : []);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    }

    fetchData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return alert("Unauthorized");

    // Trim inputs for safety
    const title = form.title.trim();
    const date = form.date;
    const categoryId = form.categoryId;
    const subcontractorId = form.subcontractorId;
    const description = form.description.trim();

    // Validation
    if (!title || title.length < 3) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Title",
        text: "Title must be at least 3 characters long.",
        confirmButtonColor: "#000",
      });
    }

    if (!categoryId) {
      return Swal.fire({
        icon: "error",
        title: "Category Required",
        text: "Please select a category.",
        confirmButtonColor: "#000",
      });
    }

    if (!date) {
      return Swal.fire({
        icon: "error",
        title: "Date Required",
        text: "Please select an inspection date.",
        confirmButtonColor: "#000",
      });
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset time for comparison
    if (selectedDate < today) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Inspection date cannot be in the past.",
        confirmButtonColor: "#000",
      });
    }

    if (!subcontractorId) {
      return Swal.fire({
        icon: "error",
        title: "Subcontractor Required",
        text: "Please select a subcontractor.",
        confirmButtonColor: "#000",
      });
    }

    if (description.length > 500) {
      return Swal.fire({
        icon: "error",
        title: "Notes Too Long",
        text: "Notes cannot exceed 500 characters.",
        confirmButtonColor: "#000",
      });
    }

    // Passed all validation
    setLoading(true);
    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create inspection");

      await Swal.fire({
        title: "Success!",
        text: "Inspection created successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#000",
      });

      router.push("/inspections");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  if (role?.toLowerCase() === "subcontractor") return null;

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Create Inspection</h1>
          <span className={styles.subTitle}>
            Fill out the details below to create a new site inspection and assign it to a subcontractor.
          </span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label>Inspection Title <span className={styles.required}>*</span></label>
            <input
              type="text"
              name="title"
              placeholder="Site Safety Inspection"
              value={form.title}
              onChange={handleChange}

            />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label>Category <span className={styles.required}>*</span></label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}

            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className={styles.formGroup}>
            <label>Inspection Date <span className={styles.required}>*</span></label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}

            />
          </div>

          {/* Subcontractor */}
          <div className={styles.formGroup}>
            <label>Subcontractor <span className={styles.required}>*</span></label>
            <select
              name="subcontractorId"
              value={form.subcontractorId}
              onChange={handleChange}

            >
              <option value="">Select Subcontractor</option>
              {subcontractors.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes (full width) */}
        <div className={styles.formGroup}>
          <label>Inspection Notes</label>
          <textarea
            name="description"
            placeholder="Any observations or notes"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.action}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className={styles.primary} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
