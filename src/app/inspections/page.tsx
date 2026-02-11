"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/inspections.module.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

interface UserInfo {
  name: string;
  role: string;
}

interface Inspection {
  _id: string;
  title: string;
  date: string;
  category: string;
  createdBy: UserInfo;
  assignedJS: UserInfo;
  findings: string;
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    if (!token) return;

    const fetchInspections = async () => {
      try {
        const res = await fetch("/api/inspections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setInspections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch inspections:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch inspections",
          confirmButtonColor: "#000",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [token]);
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role.toLowerCase());
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/inspections/edit/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        console.warn("Empty response from server");
      }

      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setInspections((prev) => prev.filter((i) => i._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Inspection deleted successfully",
        confirmButtonColor: "#000",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong",
        confirmButtonColor: "#000",
      });
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Inspections</h1>
          <span className={styles.subTitle}>Manage all your inspections efficiently</span>
        </div>
        <div>
          {userRole !== "subcontractor" && (
            <Link href="/inspections/create" className={styles.createBtn}>
              + Add Inspection
            </Link>
          )}
        </div>
      </div>

      {/* Loading or No Records Message */}
      {loading && (
        <div className={styles.loading} style={{ marginTop: "20px" }}>
          Loading inspections...
        </div>
      )}
      {!loading && inspections.length === 0 && (
        <div className={styles.noRecords} style={{ marginTop: "20px" }}>
          No inspections added yet.
        </div>
      )}

      {/* Inspections Table */}
      {!loading && inspections.length > 0 && (
        <div className={styles.table} style={{ marginTop: "20px" }}>
          <div className={styles.header}>
            <span>#</span>
            <span>Title</span>
            <span>Date</span>
            <span>Category</span> {/* New column */}
            <span>{userRole === "subcontractor" ? "Created By" : "Assigned To"}</span>
            <span>Findings</span>
            <span>Action</span>
          </div>

          {inspections.map((item, idx) => (
            <div key={item._id} className={styles.row}>
              <span>{idx + 1}</span>
              <span>{item.title}</span>
              <span>
                <span className={styles.badge}>{formatDate(item.date)}</span>
              </span>

              {/* Category Column */}
              <span>{(item as any).category?.name || "N/A"}</span>

              {/* Dynamic field: Created By / Assigned To */}
              <span>
                {userRole === "subcontractor"
                  ? item.createdBy?.name || "Unknown"   // Main Contractor / JS
                  : item.assignedJS?.name || "Unassigned"}
                <br />
                <small className={styles.smallText}>
                  {userRole === "subcontractor"
                    ? item.createdBy?.role || "N/A"
                    : item.assignedJS?.role || "N/A"}
                </small>
              </span>

              <span>{item.findings || "N/A"}</span>
              <span className={styles.actions}>
                {/* View */}
                <Link href={`/inspections/${item._id}`} title="View Inspection">
                  <button className={styles.actionBtns}>
                    <FaEye />
                  </button>
                </Link>

                {userRole !== "subcontractor" && (
                  <>
                    <Link href={`/inspections/edit/${item._id}`} title="Edit Inspection">
                      <button className={styles.actionBtns}>
                        <FaEdit />
                      </button>
                    </Link>

                    <button
                      className={styles.actionBtns}
                      title="Delete Inspection"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
