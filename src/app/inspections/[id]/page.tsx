"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import styles from "../inspections.module.css";

// Dummy categories + questions
const categories = [
  { id: 1, name: "Site" },
  { id: 2, name: "Activity" },
  { id: 3, name: "Asset" },
];

const allQuestions = [
  { id: 1, category_id: 1, text: "Are access routes clear?" },
  { id: 2, category_id: 1, text: "Is PPE being worn?" },
  { id: 3, category_id: 1, text: "Are tools in good condition?" },
  { id: 4, category_id: 2, text: "Has activity plan been reviewed?" },
  { id: 5, category_id: 2, text: "Are required permits in place?" },
  { id: 6, category_id: 3, text: "Is the machine inspected before use?" },
  { id: 7, category_id: 3, text: "Is maintenance up-to-date?" },
];

// Modal Props type
interface Action {
  questionId: number;
  title: string;
  assignee: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Closed";
  evidence: string[];
}

interface ModalProps {
  questionId: number;
  onClose: () => void;
  onSave: (action: Action) => void;
}

// Raise Action Modal Component
function RaiseActionModal({ questionId, onClose, onSave }: ModalProps) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"Open" | "In Progress" | "Closed">("Open");
  const [evidence, setEvidence] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files).map(file => file.name);
    setEvidence(filesArray);
  };

  const handleSave = () => {
    if (!title || !assignee || !dueDate) {
      alert("Please fill all required fields");
      return;
    }
    onSave({ questionId, title, assignee, dueDate, status, evidence });
    onClose();
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>Raise Action</h3>

        <label>Action Title*</label>
        <input
          type="text"
          placeholder="Enter action title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Assign To (Subcontractor)*</label>
        <input
          type="text"
          placeholder="Enter assignee name"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />

        <label>Due Date*</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <label>Evidence / Files</label>
        <input type="file" multiple onChange={handleFileChange} />
        {evidence.length > 0 && (
          <p className={styles.commentNote}>Selected Files: {evidence.join(", ")}</p>
        )}

        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} className={styles.saveBtn}>Save Action</button>
        </div>
      </div>
    </div>
  );
}

// Main Inspection Detail Page
export default function InspectionDetail() {
  const { id } = useParams();

  const [inspection] = useState({
    title: "Block A Site Safety",
    category_id: 1,
    date: "2026-02-06",
    subcontractor: "ABC Electrical",
    status: "Draft",
  });

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [actions, setActions] = useState<Action[]>([]);
  const [showModal, setShowModal] = useState<number | null>(null);

  const questions = allQuestions.filter(q => q.category_id === inspection.category_id);
  const isActionSaved = (qId: number) => actions.some(a => a.questionId === qId);
  const handleAnswer = (qId: number, value: string) => setAnswers({ ...answers, [qId]: value });
  const handleSave = () => { console.log("Draft saved", answers); alert("Draft saved!"); };
  const handleSubmit = () => { console.log("Submitted", answers); alert("Inspection submitted!"); };
  const handleSaveAction = (action: Action) => setActions([...actions, action]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>{inspection.title}</h2>
        <div className={styles.meta}>
          <span>Type: {categories.find(c => c.id === inspection.category_id)?.name}</span>
          <span>Date: {inspection.date}</span>
          <span>Status: {inspection.status}</span>
          <span>Subcontractor: {inspection.subcontractor}</span>
        </div>
      </div>

      {/* Questions */}
      <div className={styles.questions}>
        {questions.map((q) => (
          <div key={q.id} className={styles.questionCard}>
            <p className={styles.questionText}>{q.text}</p>

            <div className={styles.options}>
              {["Yes", "No", "N/A"].map(opt => (
                <button
                  key={opt}
                  className={`${styles.optionBtn} ${answers[q.id] === opt ? styles.active : ""}`}
                  onClick={() => handleAnswer(q.id, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>

            {answers[q.id] === "No" && (
              <button
                className={`${styles.actionBtn} ${isActionSaved(q.id) ? styles.actionSaved : ""}`}
                onClick={() => setShowModal(q.id)}
              >
                {isActionSaved(q.id) ? " Action Saved" : "+ Raise Action"}
              </button>
            )}
            {answers[q.id] && answers[q.id] !== "No" && (
              <p className={styles.commentNote}>Answer: {answers[q.id]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleSave}>Save Draft</button>
        <button className={styles.submitBtn} onClick={handleSubmit}>Submit Inspection</button>
      </div>

      {/* Raise Action Modal */}
      {showModal !== null && (
        <RaiseActionModal
          questionId={showModal}
          onClose={() => setShowModal(null)}
          onSave={handleSaveAction}
        />
      )}
    </div>
  );
}
