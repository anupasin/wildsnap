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

  // When empty, render a fully centered empty state
  if (entries.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 20px",
          minHeight: "60vh",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px 0" }}>
          My Field Guide
        </h1>
        <p style={{ color: "#6b655a", margin: "0 0 32px 0" }}>
          Nothing collected yet.
        </p>

        <div style={{ fontSize: 52, marginBottom: 16 }}>🌱</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px 0" }}>
          Your field guide is empty
        </h2>
        <p
          style={{
            color: "#6b655a",
            maxWidth: 360,
            lineHeight: 1.5,
            margin: "0 0 28px 0",
          }}
        >
          Point your camera at a plant, flower, tree, bird, or a bit of wild
          landscape — everything you identify collects here.
        </p>

        <Link
          href="/"
          style={{
            color: "#2f5d45",
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 16,
          }}
        >
          Identify your first find →
        </Link>
      </div>
    );
  }

  // Normal state with entries
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "4px 0" }}>
          My Field Guide
        </h1>
        <p style={{ color: "#6b655a", margin: 0 }}>
          {`${entries.length} ${entries.length === 1 ? "find" : "finds"} collected`}
        </p>
      </div>

      <FieldGuideList entries={entries} onOpen={setOpen} />

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
