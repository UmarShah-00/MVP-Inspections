"use client";

import "../../styles/globals.css";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#000000", // black background
        fontFamily: "'Inter', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "2.5rem",
          boxSizing: "border-box",
          background: "#ffffff", // white card
          borderRadius: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)", // soft shadow
        }}
      >
        {children}
      </div>
    </div>
  );
}
