"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showLayout = !pathname.startsWith("/login");

    return (
        <>
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
        </>
    );
}
