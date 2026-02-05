"use client";

import "../styles/globals.css";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showLayout = !pathname.startsWith("/login"); // hide sidebar/navbar on login

  return (
    <html lang="en">
      <body>
        {showLayout && <Sidebar />}
        {showLayout && <Navbar />}
        <main
          style={{
            marginLeft: showLayout ? 220 : 0, 
            padding: showLayout ? "24px 32px" : 0, 
            minHeight: "100vh",
            background: "var(--bg)",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
