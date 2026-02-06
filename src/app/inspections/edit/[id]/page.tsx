"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import styles from "@/styles/createInspection.module.css";

interface FormState {
  title: string;
  date: string;
  categoryId: string;
  subcontractorId: string;
  description: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Subcontractor {
  _id: string;
  name: string;
}

export default function EditInspectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [form, setForm] = useState<FormState>({
    title: "",
    date: "",
    categoryId: "",
    subcontractorId: "",
    description: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [catRes, subRes, inspRes] = await Promise.all([
          fetch("/api/categories", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/inspections/edit/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const catData = await catRes.json();
        setCategories(catData.categories || []);

        const subData = await subRes.json();
        setSubcontractors(subData.users || []);

        const inspData = await inspRes.json();
        const inspection = inspData.inspection;

        if (inspection) {
          setForm({
            title: inspection.title || "",
            date: inspection.date ? inspection.date.split("T")[0] : "",
            categoryId: inspection.categoryId?._id || "",
            subcontractorId: inspection.subcontractorId?._id || "",
            description: inspection.description || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load inspection data",
        });
      }
    };

    fetchData();
  }, [token, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return alert("Unauthorized");

    setLoading(true);

    try {
      const res = await fetch(`/api/inspections/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update inspection");

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Inspection updated successfully",
        confirmButtonColor: "#000",
      });

      router.push("/inspections");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Edit Inspection</h1>
          <span className={styles.subTitle}>
            Update the details of this inspection and assign it to a subcontractor.
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
            <select name="categoryId" value={form.categoryId} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className={styles.formGroup}>
            <label>Inspection Date <span className={styles.required}>*</span></label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </div>

          {/* Subcontractor */}
          <div className={styles.formGroup}>
            <label>Subcontractor <span className={styles.required}>*</span></label>
            <select name="subcontractorId" value={form.subcontractorId} onChange={handleChange}>
              <option value="">Select Subcontractor</option>
              {subcontractors.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className={styles.formGroup}>
          <label>Inspection Notes</label>
          <textarea
            name="description"
            placeholder="Any observations or notes"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className={styles.action}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => router.back()}
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
