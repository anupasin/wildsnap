import { View, Text, StyleSheet } from "react-native";
import type { Confidence } from "@wildsnap/core";
import { confidenceMeta, radius, spacing, type } from "./theme";

/** Small pill showing how sure the model was. */
export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const meta = confidenceMeta[confidence];
  return (
    <View style={[styles.pill, { backgroundColor: meta.bg }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    gap: spacing.xs,
  },
  dot: { width: 7, height: 7, borderRadius: radius.pill },
  label: { fontSize: type.tiny, fontWeight: "700", letterSpacing: 0.3 },
});
