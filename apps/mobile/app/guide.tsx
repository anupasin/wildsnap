import { useCallback, useState } from "react";
import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import type { FieldGuideEntry } from "@wildsnap/core";
import { FieldGuideList, ResultCard, colors, spacing, radius, type } from "@wildsnap/ui";
import { mobileStorage } from "../lib/mobileStorage";

export default function GuideScreen() {
  const [entries, setEntries] = useState<FieldGuideEntry[] | null>(null);
  const [open, setOpen] = useState<FieldGuideEntry | null>(null);

  const refresh = useCallback(async () => {
    setEntries(await mobileStorage.list());
  }, []);

  // Refresh every time this tab gains focus — a save on the Identify tab
  // should show up here without a manual reload.
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  async function remove(id: string) {
    await mobileStorage.remove(id);
    setOpen(null);
    await refresh();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Field Guide</Text>
        <Text style={styles.subtitle}>
          {entries === null
            ? "Loading…"
            : entries.length === 0
              ? "Nothing collected yet."
              : `${entries.length} ${entries.length === 1 ? "find" : "finds"} collected`}
        </Text>
      </View>

      {entries !== null ? (
        <FieldGuideList entries={entries} onOpen={setOpen} />
      ) : null}

      <Modal
        visible={open !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setOpen(null)}
      >
        <ScrollView contentContainerStyle={styles.modalScroll}>
          <Pressable style={styles.closeBtn} onPress={() => setOpen(null)}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          {open ? (
            <ResultCard
              identification={open.identification}
              image={open.image}
              defaultExpanded
              onRetry={() => remove(open.id)}
              retryLabel="Remove from field guide"
            />
          ) : null}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, gap: spacing.lg },
  header: { gap: spacing.xs },
  title: { fontSize: type.hero, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: type.small, color: colors.inkSoft },
  modalScroll: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: "center",
    backgroundColor: colors.canvas,
    minHeight: "100%",
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  closeText: { fontSize: 16, fontWeight: "700", color: colors.ink },
});
