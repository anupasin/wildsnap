"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FieldGuideEntry } from "@wildsnap/core";
import { FieldGuideList, ResultCard } from "@wildsnap/ui";
import { webStorage } from "../../lib/webStorage";

export default function GuidePage() {
  const [entries, setEntries] = useState<FieldGuideEntry[] | null>(null);
  const [open, setOpen] = useState<FieldGuideEntry | null>(null);

  async function refresh() {
    setEntries(await webStorage.list());
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function remove(id: string) {
    await webStorage.remove(id);
    setOpen(null);
    await refresh();
  }

  if (entries === null) {
    return <p style={{ textAlign: "center", color: "#6b655a" }}>Loading…</p>;
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "4px 0" }}>
          My Field Guide
        </h1>
        <p style={{ color: "#6b655a", margin: 0 }}>
          {entries.length === 0
            ? "Nothing collected yet."
            : `${entries.length} ${entries.length === 1 ? "find" : "finds"} collected`}
        </p>
      </div>

      <FieldGuideList entries={entries} onOpen={setOpen} />

      {entries.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Link href="/" style={{ color: "#2f5d45", fontWeight: 700, textDecoration: "none" }}>
            Identify your first find →
          </Link>
        </div>
      ) : null}

      {open ? (
        <div style={overlay} onClick={() => setOpen(null)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <button style={closeBtn} onClick={() => setOpen(null)} aria-label="Close">
              ✕
            </button>
            <ResultCard
              identification={open.identification}
              image={open.image}
              defaultExpanded
              onRetry={() => remove(open.id)}
              retryLabel="Remove from field guide"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(38,36,31,0.55)",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "40px 16px",
  overflowY: "auto",
  zIndex: 50,
};
const modal: React.CSSProperties = { position: "relative", width: "100%", maxWidth: 460 };
const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: -14,
  right: -6,
  zIndex: 2,
  width: 36,
  height: 36,
  borderRadius: 999,
  border: "none",
  background: "#fff",
  color: "#26241f",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
};
