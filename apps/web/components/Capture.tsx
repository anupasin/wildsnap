"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_DIM = 1280; // downscale longest edge to keep payloads small

/** Draw a source image/video onto a canvas, scaled to <= MAX_DIM, as JPEG. */
function toScaledDataUrl(
  source: HTMLImageElement | HTMLVideoElement,
  w: number,
  h: number,
): string {
  const scale = Math.min(1, MAX_DIM / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const out = toScaledDataUrl(img, img.naturalWidth, img.naturalHeight);
        URL.revokeObjectURL(url);
        resolve(out);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image."));
    };
    img.src = url;
  });
}

export function Capture({
  onCapture,
  busy,
}: {
  onCapture: (dataUrl: string) => void;
  busy?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      // Wait a tick for the video element to mount.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setError(
        "Couldn't open the camera. You can still upload or drag in a photo.",
      );
    }
  }, []);

  const shoot = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const out = toScaledDataUrl(video, video.videoWidth, video.videoHeight);
    stopCamera();
    onCapture(out);
  }, [onCapture, stopCamera]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      setError(null);
      try {
        onCapture(await fileToDataUrl(file));
      } catch {
        setError("That file didn't look like an image. Try another.");
      }
    },
    [onCapture],
  );

  if (cameraOn) {
    return (
      <div style={styles.frame}>
        <video ref={videoRef} playsInline muted style={styles.video} />
        <div style={styles.camActions}>
          <button style={styles.ghost} onClick={stopCamera} disabled={busy}>
            Cancel
          </button>
          <button style={styles.shutter} onClick={shoot} disabled={busy}>
            <span style={styles.shutterDot} />
          </button>
          <span style={{ width: 84 }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        style={{
          ...styles.dropzone,
          ...(dragOver ? styles.dropzoneActive : null),
          ...(busy ? styles.dim : null),
        }}
      >
        <div style={{ fontSize: 46 }}>📷</div>
        <div style={styles.dzTitle}>Snap or drop a bit of nature</div>
        <div style={styles.dzSub}>
          A tree, flower, bird, or a wild landscape — fill the frame for the best
          result.
        </div>
        <div style={styles.btnRow}>
          <button style={styles.primary} onClick={startCamera} disabled={busy}>
            Use camera
          </button>
          <button
            style={styles.secondary}
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
          >
            Upload a photo
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
      {error ? <p style={styles.error}>{error}</p> : null}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dropzone: {
    border: "2px dashed #d8cfbb",
    borderRadius: 24,
    background: "#fffdf8",
    padding: "40px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    transition: "border-color .15s, background .15s",
  },
  dropzoneActive: { borderColor: "#2f5d45", background: "#eef5ef" },
  dim: { opacity: 0.6, pointerEvents: "none" },
  dzTitle: { fontSize: 20, fontWeight: 800, color: "#26241f" },
  dzSub: { fontSize: 14, color: "#6b655a", maxWidth: 340, lineHeight: 1.5 },
  btnRow: { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", justifyContent: "center" },
  primary: {
    background: "#2f5d45",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 22px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondary: {
    background: "#fff",
    color: "#2f5d45",
    border: "1px solid #cfe0d4",
    borderRadius: 12,
    padding: "12px 22px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { color: "#8a5a4a", fontSize: 14, marginTop: 12, textAlign: "center" },
  frame: {
    borderRadius: 24,
    overflow: "hidden",
    background: "#000",
    position: "relative",
    maxWidth: 460,
    margin: "0 auto",
  },
  video: { width: "100%", display: "block", aspectRatio: "4 / 3", objectFit: "cover" },
  camActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(transparent, rgba(0,0,0,0.45))",
  },
  ghost: {
    width: 84,
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  shutter: {
    width: 66,
    height: 66,
    borderRadius: 999,
    background: "#fff",
    border: "4px solid rgba(255,255,255,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  shutterDot: { width: 46, height: 46, borderRadius: 999, background: "#2f5d45", display: "block" },
};
