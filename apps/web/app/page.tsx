"use client";

import { useState } from "react";
import Link from "next/link";
import { buildEntry, type Identification } from "@wildsnap/core";
import { ResultCard } from "@wildsnap/ui";
import { Capture } from "../components/Capture";
import { identifyImage } from "../lib/identifyClient";
import { webStorage } from "../lib/webStorage";

type Status = "idle" | "identifying" | "done" | "error";

export default function IdentifyPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Identification | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCapture(dataUrl: string) {
    setImage(dataUrl);
    setResult(null);
    setSaved(false);
    setError(null);
    setStatus("identifying");
    try {
      const id = await identifyImage(dataUrl);
      setResult(id);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function reset() {
    setImage(null);
    setResult(null);
    setSaved(false);
    setError(null);
    setStatus("idle");
  }

  async function save() {
    if (!result || !image) return;
    await webStorage.add(buildEntry(result, image));
    setSaved(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {status === "idle" ? (
        <>
          <div style={{ textAlign: "center", maxWidth: 460 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "8px 0" }}>
              What did you spot?
            </h1>
            <p style={{ color: "#6b655a", margin: 0, lineHeight: 1.5 }}>
              Point your camera at something wild and we&apos;ll tell you what it
              is — then tuck it into your field guide.
            </p>
          </div>
          <div style={{ width: "100%", maxWidth: 460 }}>
            <Capture onCapture={handleCapture} />
          </div>
        </>
      ) : null}

      {status === "identifying" && image ? (
        <div style={loadingCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Your capture" style={loadingImg} />
          <div style={loadingOverlay}>
            <div style={spinner} />
            <span style={{ fontWeight: 700, color: "#fff" }}>Identifying…</span>
          </div>
        </div>
      ) : null}

      {status === "done" && result && image ? (
        <>
          <ResultCard
            identification={result}
            image={image}
            onSave={save}
            saved={saved}
            onRetry={reset}
            retryLabel="Identify another"
          />
          {saved ? (
            <Link href="/guide" style={savedLink}>
              View your field guide →
            </Link>
          ) : null}
        </>
      ) : null}

      {status === "error" ? (
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <p style={{ color: "#8a5a4a", fontWeight: 600 }}>{error}</p>
          <button style={retryBtn} onClick={reset}>
            Try again
          </button>
        </div>
      ) : null}

      <style>{spinKeyframes}</style>
    </div>
  );
}

const loadingCard: React.CSSProperties = {
  width: "100%",
  maxWidth: 460,
  borderRadius: 24,
  overflow: "hidden",
  position: "relative",
  border: "1px solid #e7e0d2",
};
const loadingImg: React.CSSProperties = {
  width: "100%",
  aspectRatio: "4 / 3",
  objectFit: "cover",
  display: "block",
};
const loadingOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  background: "rgba(38,36,31,0.45)",
};
const spinner: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 999,
  border: "3px solid rgba(255,255,255,0.4)",
  borderTopColor: "#fff",
  animation: "wildsnap-spin 0.8s linear infinite",
};
const savedLink: React.CSSProperties = {
  color: "#2f5d45",
  fontWeight: 700,
  textDecoration: "none",
  fontSize: 15,
};
const retryBtn: React.CSSProperties = {
  background: "#2f5d45",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "12px 22px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 8,
};
const spinKeyframes = `@keyframes wildsnap-spin { to { transform: rotate(360deg); } }`;
