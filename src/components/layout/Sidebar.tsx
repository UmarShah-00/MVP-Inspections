"use client";

import styles from "./Layout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, JSX } from "react";

// Icons
import {
  FiHome,
  FiClipboard,
  FiCheckSquare,
  FiUsers,
  FiChevronDown,
  FiFolder,
  FiEdit,
} from "react-icons/fi";

interface MenuItem {
  key: string;
  name: string;
  icon: JSX.Element;
  link?: string;
  subMenu?: { name: string; link: string }[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Menu definitions
  const menuItems: MenuItem[] = [
    { key: "dashboard", name: "Dashboard", icon: <FiHome />, link: "/" },
    {
      key: "inspections",
      name: "Inspections",
      icon: <FiClipboard />,
      subMenu: [
        { name: "Inspection List", link: "/inspections" },
        { name: "Create Inspection", link: "/inspections/create" },
      ],
    },
    {
      key: "actions",
      name: "Actions",
      icon: <FiCheckSquare />,
      subMenu: [{ name: "Actions List", link: "/actions" }],
    },
      {
       key: "users",
      name: "Users",
      icon: <FiUsers />,
      subMenu: [{ name: "Users List", link: "/users" }],
    },
    {
      key: "categories",
      name: "Categories",
      icon: <FiFolder />,
      subMenu: [{ name: "Category List", link: "/categories" }],
    },
    {
      key: "questions",
      name: "Questions",
      icon: <FiEdit />,
      link: "/questions",
    },
  ];

  // Auto open current menu based on URL
  useEffect(() => {
    const activeItem = menuItems.find((item) => {
      if (item.link && item.link === pathname) return true;
      if (item.subMenu?.some((sub) => sub.link === pathname)) return true;
      return false;
    });
    if (activeItem) setOpenMenu(activeItem.key);
  }, [pathname]);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Safety MVP</h2>

      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <div key={item.key}>
            {item.subMenu ? (
              <>
                <button
                  className={`${styles.menuItem} ${openMenu === item.key ? styles.active : ""
                    }`}
                  onClick={() =>
                    setOpenMenu(openMenu === item.key ? null : item.key)
                  }
                >
                  <div className={styles.menuLeft}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <FiChevronDown
                    className={`${styles.chevron} ${openMenu === item.key ? styles.rotate : ""
                      }`}
                  />
                </button>
                {openMenu === item.key && (
                  <div className={styles.subMenu}>
                    {item.subMenu.map((sub) => (
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
              </>
            ) : (
              <Link
                href={item.link || "#"}
                className={`${styles.menuItem} ${pathname === item.link ? styles.active : ""
                  }`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.namemenu}>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
