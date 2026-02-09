"use client";

import styles from "@/styles/Layout.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, JSX } from "react";

// Icons
import {
  FiHome,
  FiClipboard,
  FiCheckSquare,
  FiUsers,
  FiChevronDown,
  FiFolder,
  FiEdit,
  FiLogOut,
} from "react-icons/fi";

interface MenuItem {
  key: string;
  name: string;
  icon: JSX.Element;
  link?: string;
  subMenu?: { name: string; link: string }[];
  role?: "all" | "main" | "sub"; // Role-based
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("role")?.toLowerCase() || "";
    setUserRole(role);
  }, []);

  const menuItems: MenuItem[] = [
    { key: "dashboard", name: "Dashboard", icon: <FiHome />, link: "/dashboard", role: "all" },
    {
      key: "inspections",
      name: "Inspections",
      icon: <FiClipboard />,
      subMenu: [{ name: "Inspection", link: "/inspections" }],
      role: "all",
    },
    {
      key: "actions",
      name: "Actions",
      icon: <FiCheckSquare />,
      subMenu: [{ name: "Actions", link: "/actions" }],
      role: "all",
    },
    {
      key: "users",
      name: "Users",
      icon: <FiUsers />,
      subMenu: [{ name: "Users", link: "/users" }],
      role: "main",
    },
    {
      key: "categories",
      name: "Categories",
      icon: <FiFolder />,
      subMenu: [{ name: "Categories", link: "/categories" }],
      role: "main",
    },
    {
      key: "questions",
      name: "Questions",
      icon: <FiEdit />,
      subMenu: [{ name: "Questions", link: "/questions" }],
      role: "main",
    },
    {
      key: "logout",
      name: "Logout",
      icon: <FiLogOut />,
      link: "#",
      role: "all",
    },
  ];

  const handleClick = (key: string) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.key === "logout") return handleLogout();
    if (item.subMenu && item.subMenu.length > 0) return handleClick(item.key);
    if (item.link) router.push(item.link); // Navigate if link exists
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>MVP Inspection</h2>

      <nav className={styles.menu}>
        {menuItems
          .filter(
            (item) =>
              item.role === "all" ||
              (item.role === "main" && userRole === "main contractor") ||
              (item.role === "sub" && userRole === "subcontractor")
          )
          .map((item) => {
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;

            return (
              <div key={item.key}>
                <button
                  className={`${styles.menuItem} ${
                    openMenu === item.key ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                  type="button"
                >
                  <div className={styles.menuLeft}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {hasSubMenu && (
                    <FiChevronDown
                      className={`${styles.chevron} ${
                        openMenu === item.key ? styles.rotate : ""
                      }`}
                    />
                  )}
                </button>

                {hasSubMenu && openMenu === item.key && (
                  <div className={styles.subMenu}>
                    {item.subMenu!.map((sub) => (
                      <Link
                        key={sub.link}
                        href={sub.link}
                        className={pathname === sub.link ? styles.active : ""}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </nav>
    </aside>
  );
}
