"use client";

import { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import type { Identification } from "@wildsnap/core";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { categoryMeta, colors, radius, spacing, type } from "./theme";

export interface ResultCardProps {
  identification: Identification;
  /** Data URL of the captured photo. */
  image: string;
  /** Called when the user collects this into their field guide. */
  onSave?: () => void;
  /** When true, the card shows a "Saved" state instead of a Save button. */
  saved?: boolean;
  /** Optional secondary action, e.g. "Identify another" / "Try again". */
  onRetry?: () => void;
  retryLabel?: string;
  /** Start with the rich detail expanded (used when reopening from the guide). */
  defaultExpanded?: boolean;
}

/**
 * The heart of WildSnap: a warm, tappable field-guide card. Big image, clear
 * name, minimal text up front, and a "Learn more" reveal for the rich detail.
 * Shared verbatim across web and mobile via react-native-web.
 */
export function ResultCard({
  identification,
  image,
  onSave,
  saved,
  onRetry,
  retryLabel,
  defaultExpanded,
}: ResultCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const cat = categoryMeta[identification.category];
  const hasFacts = identification.funFacts.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={identification.name}
        />
        <View style={styles.catChip}>
          <Text style={styles.catEmoji}>{cat.emoji}</Text>
          <Text style={styles.catLabel}>{cat.label}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {identification.identified ? (
          <>
            <View style={styles.headingRow}>
              <View style={styles.headingText}>
                <Text style={styles.name}>{identification.name}</Text>
                {identification.scientificName ? (
                  <Text style={styles.sci}>{identification.scientificName}</Text>
                ) : null}
              </View>
              <ConfidenceBadge confidence={identification.confidence} />
            </View>

            <Text style={styles.description}>{identification.description}</Text>

            {hasFacts ? (
              <Pressable
                onPress={() => setExpanded((e) => !e)}
                style={({ pressed }) => [
                  styles.learnMore,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
              >
                <Text style={styles.learnMoreText}>
                  {expanded ? "Hide details" : "Learn more"}
                </Text>
                <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
              </Pressable>
            ) : null}

            {expanded && hasFacts ? (
              <View style={styles.facts}>
                <Text style={styles.factsHeading}>Did you know?</Text>
                {identification.funFacts.map((fact, i) => (
                  <View key={i} style={styles.factRow}>
                    <Text style={styles.factLeaf}>🌿</Text>
                    <Text style={styles.factText}>{fact}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.notFound}>
            <Text style={styles.notFoundEmoji}>🧐</Text>
            <Text style={styles.name}>{identification.name}</Text>
            <Text style={styles.description}>{identification.description}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {identification.identified && onSave ? (
            <Pressable
              onPress={saved ? undefined : onSave}
              disabled={saved}
              style={({ pressed }) => [
                styles.primaryBtn,
                saved && styles.savedBtn,
                pressed && !saved && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={[styles.primaryBtnText, saved && styles.savedBtnText]}>
                {saved ? "✓ In your field guide" : "＋ Add to field guide"}
              </Text>
            </Pressable>
          ) : null}

          {onRetry ? (
            <Pressable
              onPress={onRetry}
              style={({ pressed }) => [styles.ghostBtn, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={styles.ghostBtnText}>
                {retryLabel ?? "Identify another"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    // Soft, warm elevation (supported on web + modern React Native).
    boxShadow: "0px 12px 24px rgba(74,59,34,0.14)",
  },
  imageWrap: { width: "100%", aspectRatio: 4 / 3, backgroundColor: colors.surfaceSunken },
  image: { width: "100%", height: "100%" },
  catChip: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  catEmoji: { fontSize: type.small },
  catLabel: { fontSize: type.tiny, fontWeight: "700", color: colors.ink },

  body: { padding: spacing.xl, gap: spacing.md },
  headingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headingText: { flex: 1, gap: 2 },
  name: { fontSize: type.hero, fontWeight: "800", color: colors.ink, lineHeight: 34 },
  sci: { fontSize: type.small, fontStyle: "italic", color: colors.inkFaint },
  description: { fontSize: type.body, lineHeight: 24, color: colors.inkSoft },

  learnMore: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.forestSoft,
    borderRadius: radius.pill,
  },
  learnMoreText: { fontSize: type.small, fontWeight: "700", color: colors.forest },
  chevron: { fontSize: 10, color: colors.forest },

  facts: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  factsHeading: {
    fontSize: type.tiny,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colors.amber,
  },
  factRow: { flexDirection: "row", gap: spacing.sm },
  factLeaf: { fontSize: type.small, marginTop: 2 },
  factText: { flex: 1, fontSize: type.small, lineHeight: 22, color: colors.ink },

  notFound: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.sm },
  notFoundEmoji: { fontSize: 40 },

  actions: { gap: spacing.sm, marginTop: spacing.xs },
  primaryBtn: {
    backgroundColor: colors.forest,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
  },
  primaryBtnText: { color: colors.white, fontSize: type.body, fontWeight: "700" },
  savedBtn: { backgroundColor: colors.forestSoft },
  savedBtnText: { color: colors.forest },
  ghostBtn: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostBtnText: { color: colors.inkSoft, fontSize: type.small, fontWeight: "700" },
  pressed: { opacity: 0.85 },
});
