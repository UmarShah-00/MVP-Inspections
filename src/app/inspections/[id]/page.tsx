"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "@/styles/inspections.module.css";

import RaiseActionModal, { Action } from "../RaiseActionModal";

interface Question {
  _id: string;
  text: string;
}

export default function InspectionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [inspection, setInspection] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [actions, setActions] = useState<Action[]>([]);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"main contractor" | "subcontractor" | "">("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role.toLowerCase() as "main contractor" | "subcontractor");
    }
  }, []);

  // Fetch inspection data
  useEffect(() => {
    if (!token) return;

    const fetchInspection = async () => {
      try {
        const res = await fetch(`/api/inspections/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch inspection");

        setInspection(data.inspection);
        setQuestions(data.questions || []);
        setActions(data.actions || []);

        // ✅ DB se answers set karo
        const ansMap: Record<string, string> = {};
        (data.inspection.answers || []).forEach((a: any) => {
          ansMap[a.questionId] = a.answer;
        });
        setAnswers(ansMap);
      } catch (err) {
        console.error(err);
        Swal.fire({ title: "Error", text: "Failed to fetch inspection", icon: "error" });
      }
    };

    fetchInspection();
  }, [id, token]);

  // Handle question answers
  const handleAnswer = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  // Save action in state after modal
  const handleSaveAction = (action: Action) => {
    setActions((prev) => [...prev, action]);
    Swal.fire({ title: "Action Saved", icon: "success" });
  };

  // Get action status for a question
  const getActionStatus = (qId: string) => {
    const action = actions.find((a) => a.questionId === qId);
    return action ? action.status : null;
  };

  // Save draft / submit inspection
  const saveInspection = async (status: "Draft" | "Submitted") => {
    if (!token) return Swal.fire({ title: "Unauthorized", icon: "error" });

    try {
      const formData = new FormData();
      formData.append("status", status);

      // append answers
      formData.append(
        "answers",
        JSON.stringify(
          Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }))
        )
      );

      // append new actions
      const newActions = actions.filter((a) => !a._id);
      formData.append("newActions", JSON.stringify(newActions));

      // append files from each action
      newActions.forEach((a) => {
        a.evidence?.forEach((file) => {
          formData.append(`${a.questionId}`, file as any);
        });
      });

      const res = await fetch(`/api/inspections/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }, // Content-Type mat do
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save inspection");

      setInspection(data.inspection);
      setActions(data.savedActions || []);

      Swal.fire({
        title: "Success",
        text: status === "Draft" ? "Draft saved successfully!" : "Inspection submitted!",
        icon: "success",
        confirmButtonColor: "#000",
      });

      router.push("/inspections");
    } catch (err: any) {
      console.error(err);
      Swal.fire({ title: "Error", text: err.message || "Something went wrong", icon: "error" });
    }
  };


  if (!inspection) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Inspection Details</h1>
      <span className={styles.subTitle}>
        Review the inspection details, answer questions, and raise actions if required.
      </span>

      {/* ===== HEADER ===== */}
      <div className={styles.headers}>
        <h2>{inspection.title}</h2>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category</span>
            <span className={styles.metaValue}>{inspection.categoryId?.name || "N/A"}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Inspection Date</span>
            <span className={styles.badge}>{new Date(inspection.date).toLocaleDateString()}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Status</span>
            <span className={styles.status}>{inspection.status}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Assigned JS</span>
            <span className={styles.metaValue}>{inspection.subcontractorId?.name || "Unassigned"}</span>
            <small className={styles.metaSub}>{inspection.subcontractorId?.role || "N/A"}</small>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Created By</span>
            <span className={styles.metaValue}>{inspection.createdBy?.name}</span>
            <small className={styles.metaSub}>{inspection.createdBy?.role || "N/A"}</small>
          </div>
        </div>
      </div>


      {/* ===== QUESTIONS ===== */}
      <div className={styles.questions}>
        {questions.map((q) => {
          // Use DB answers if state is empty
          const answer = answers[q._id] || "";
          const status = getActionStatus(q._id);

          return (
            <div key={q._id} className={styles.questionCard}>
              <p className={styles.questionText}>{q.text}</p>

              <div className={styles.options}>
                {["Yes", "No", "N/A"].map((opt) => (
                  <button
                    key={opt}
                    className={`${styles.optionBtn} ${answer === opt ? styles.active : ""}`}
                    onClick={() => handleAnswer(q._id, opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {answer === "Yes" && (
                <p
                  className={styles.yesNote}
                  style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px" }}
                >
                  Answer: Yes
                </p>
              )}

              {answer === "No" && (
                userRole === "main contractor" ? (
                  <button
                    className={`${styles.actionBtn} ${status ? styles.actionSaved : ""}`}
                    onClick={() => {
                      if (!status) setShowModal(q._id);
                    }}
                  >
                    {!status ? "+ Raise Action" : `Action Saved (${status})`}
                  </button>
                ) : (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#dc2626",
                      marginTop: "4px",
                    }}
                  >
                    Answer: No
                  </p>
                )
              )}

            </div>
          );
        })}
      </div>
      {/* ===== FOOTER ===== */}
      <div className={styles.footer}>
        <button className={styles.secondary} onClick={() => router.back()}>
          Cancel
        </button>
        <button className={styles.saveBtn} onClick={() => saveInspection("Draft")}>
          Save Draft
        </button>
        <button className={styles.submitBtn} onClick={() => saveInspection("Submitted")}>
          Submit Inspection
        </button>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <RaiseActionModal
          questionId={showModal}
          onClose={() => setShowModal(null)}
          onSave={handleSaveAction}
          inspectionId={inspection._id}
        />
      )}
    </div>
  );
}
