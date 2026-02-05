"use client";

import { useRef, useState } from "react";
import styles from "./EvidenceBox.module.css";

export default function EvidenceBox() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("No files uploaded");
  const [preview, setPreview] = useState<string | null>(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  }

  return (
    <div className={styles.box}>
      <h4>Evidence</h4>

      <div className={styles.upload}>
        <p>{fileName}</p>
        <button className={styles.uploadButton} onClick={handleUploadClick}>
          Upload Evidence
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {preview && (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
        </div>
      )}
    </div>
  );
}
