"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Identify" },
  { href: "/guide", label: "My Field Guide" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header
      style={{
        borderBottom: "1px solid #e7e0d2",
        background: "rgba(246,241,231,0.85)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#2f5d45",
            fontWeight: 800,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🌿</span>
          <span>WildSnap</span>
        </Link>
        <nav style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tabs.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="nav-tab"
                style={{
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 999,
                  color: active ? "#ffffff" : "#6b655a",
                  background: active ? "#2f5d45" : "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1.2,
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
