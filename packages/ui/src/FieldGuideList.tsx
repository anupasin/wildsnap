"use client";

import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import type { FieldGuideEntry } from "@wildsnap/core";
import { categoryMeta, colors, radius, spacing, type } from "./theme";

export interface FieldGuideListProps {
  entries: FieldGuideEntry[];
  /** Reopen an entry's card. */
  onOpen: (entry: FieldGuideEntry) => void;
}

/** A friendly, tappable grid of everything the user has collected. */
export function FieldGuideList({ entries, onOpen }: FieldGuideListProps) {
  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🌱</Text>
        <Text style={styles.emptyTitle}>Your field guide is empty</Text>
        <Text style={styles.emptyText}>
          Point your camera at a plant, flower, tree, bird, or a bit of wild
          landscape — everything you identify collects here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {entries.map((entry) => {
        const id = entry.identification;
        const cat = categoryMeta[id.category];
        return (
          <Pressable
            key={entry.id}
            onPress={() => onOpen(entry)}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Open ${id.name}`}
          >
            <View style={styles.thumbWrap}>
              <Image source={{ uri: entry.image }} style={styles.thumb} resizeMode="cover" />
              <Text style={styles.thumbEmoji}>{cat.emoji}</Text>
            </View>
            <View style={styles.tileBody}>
              <Text style={styles.tileName} numberOfLines={1}>
                {id.name}
              </Text>
              {id.scientificName ? (
                <Text style={styles.tileSci} numberOfLines={1}>
                  {id.scientificName}
                </Text>
              ) : (
                <Text style={styles.tileSci}>{cat.label}</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
    justifyContent: "flex-start",
  },
  tile: {
    width: 168,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    boxShadow: "0px 6px 12px rgba(74,59,34,0.08)",
  },
  thumbWrap: { width: "100%", aspectRatio: 1, backgroundColor: colors.surfaceSunken },
  thumb: { width: "100%", height: "100%" },
  thumbEmoji: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    fontSize: type.body,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: "hidden",
  },
  tileBody: { padding: spacing.md, gap: 2 },
  tileName: { fontSize: type.small, fontWeight: "800", color: colors.ink },
  tileSci: { fontSize: type.tiny, fontStyle: "italic", color: colors.inkFaint },
  pressed: { opacity: 0.85 },

  empty: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%",
    textAlign: "center" as const, // for web compatibility
  },
  emptyEmoji: { fontSize: 52, marginBottom: spacing.md },
  emptyTitle: { fontSize: type.title, fontWeight: "800", color: colors.ink, textAlign: "center" as const },
  emptyText: { fontSize: type.small, lineHeight: 22, color: colors.inkSoft, textAlign: "center" as const },
});
