import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { buildEntry, type Identification } from "@wildsnap/core";
import { ResultCard, colors, spacing, radius, type } from "@wildsnap/ui";
import { Capture } from "../components/Capture";
import { identifyImage } from "../lib/identifyClient";
import { mobileStorage } from "../lib/mobileStorage";

type Status = "idle" | "identifying" | "done" | "error";

export default function IdentifyScreen() {
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
    await mobileStorage.add(buildEntry(result, image));
    setSaved(true);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {status === "idle" ? (
        <>
          <View style={styles.intro}>
            <Text style={styles.title}>What did you spot?</Text>
            <Text style={styles.subtitle}>
              Point your camera at something wild and we&apos;ll tell you what
              it is — then tuck it into your field guide.
            </Text>
          </View>
          <Capture onCapture={handleCapture} />
        </>
      ) : null}

      {status === "identifying" && image ? (
        <View style={styles.loadingCard}>
          <Image source={{ uri: image }} style={styles.loadingImage} />
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#fff" size="large" />
            <Text style={styles.loadingText}>Identifying…</Text>
          </View>
        </View>
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
            <Link href="/guide" style={styles.savedLink}>
              View your field guide →
            </Link>
          ) : null}
        </>
      ) : null}

      {status === "error" ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Text onPress={reset} style={styles.retryText}>
            Try again
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  intro: { alignItems: "center", gap: spacing.xs, maxWidth: 340 },
  title: { fontSize: type.hero, fontWeight: "800", color: colors.ink },
  subtitle: {
    fontSize: type.small,
    color: colors.inkSoft,
    textAlign: "center",
    lineHeight: 21,
  },
  loadingCard: {
    width: "100%",
    maxWidth: 460,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  loadingImage: { width: "100%", aspectRatio: 4 / 3 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(38,36,31,0.45)",
  },
  loadingText: { color: "#fff", fontWeight: "700" },
  savedLink: { color: colors.forest, fontWeight: "700", fontSize: type.small },
  errorBox: { alignItems: "center", gap: spacing.sm, maxWidth: 320 },
  errorText: { color: "#8A5A4A", fontWeight: "600", textAlign: "center" },
  retryText: {
    color: colors.forest,
    fontWeight: "700",
    fontSize: type.small,
    padding: spacing.sm,
  },
});
