import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { colors, radius, spacing, type } from "@wildsnap/ui";

const MAX_DIM = 1280; // matches apps/web/components/Capture.tsx

/** Resize (only if larger than MAX_DIM) and compress to a JPEG data URL. */
async function toScaledDataUrl(
  uri: string,
  width: number,
  height: number,
): Promise<string> {
  const needsResize = Math.max(width, height) > MAX_DIM;
  const actions: ImageManipulator.Action[] = needsResize
    ? [{ resize: width >= height ? { width: MAX_DIM } : { height: MAX_DIM } }]
    : [];

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: 0.85,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  if (!result.base64) {
    throw new Error("Couldn't process that photo.");
  }
  return `data:image/jpeg;base64,${result.base64}`;
}

export function Capture({
  onCapture,
  busy,
}: {
  onCapture: (dataUrl: string) => void;
  busy?: boolean;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOn, setCameraOn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  async function openCamera() {
    setError(null);
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setError(
          "Camera permission was denied. You can still pick a photo from your library.",
        );
        return;
      }
    }
    setCameraOn(true);
  }

  async function shoot() {
    if (!cameraRef.current) return;
    setProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      setCameraOn(false);
      const dataUrl = await toScaledDataUrl(photo.uri, photo.width, photo.height);
      onCapture(dataUrl);
    } catch {
      setError("Couldn't take that photo. Try again.");
      setCameraOn(false);
    } finally {
      setProcessing(false);
    }
  }

  async function pickFromLibrary() {
    setError(null);
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.9,
    });
    if (res.canceled || !res.assets[0]) return;
    setProcessing(true);
    try {
      const asset = res.assets[0];
      const dataUrl = await toScaledDataUrl(asset.uri, asset.width, asset.height);
      onCapture(dataUrl);
    } catch {
      setError("That photo couldn't be used. Try another.");
    } finally {
      setProcessing(false);
    }
  }

  if (cameraOn) {
    return (
      <View style={styles.frame}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <View style={styles.camActions}>
          <Pressable
            style={styles.ghost}
            onPress={() => setCameraOn(false)}
            disabled={processing}
          >
            <Text style={styles.ghostText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.shutter} onPress={shoot} disabled={processing}>
            {processing ? (
              <ActivityIndicator color={colors.forest} />
            ) : (
              <View style={styles.shutterDot} />
            )}
          </Pressable>
          <View style={{ width: 84 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.dropzone, busy && styles.dim]}>
      <Text style={styles.dzEmoji}>📷</Text>
      <Text style={styles.dzTitle}>Snap a bit of nature</Text>
      <Text style={styles.dzSub}>
        A tree, flower, bird, or a wild landscape — fill the frame for the best
        result.
      </Text>
      <View style={styles.btnRow}>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          onPress={openCamera}
          disabled={busy || processing}
        >
          <Text style={styles.primaryText}>Use camera</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          onPress={pickFromLibrary}
          disabled={busy || processing}
        >
          <Text style={styles.secondaryText}>Choose photo</Text>
        </Pressable>
      </View>
      {processing ? (
        <ActivityIndicator style={{ marginTop: spacing.sm }} color={colors.forest} />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#D8CFBB",
    borderRadius: radius.lg,
    backgroundColor: "#FFFDF8",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  dim: { opacity: 0.6 },
  dzEmoji: { fontSize: 46 },
  dzTitle: { fontSize: type.title, fontWeight: "800", color: colors.ink },
  dzSub: {
    fontSize: type.small,
    color: colors.inkSoft,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
  btnRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  primary: {
    backgroundColor: colors.forest,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  primaryText: { color: colors.white, fontWeight: "700", fontSize: type.small },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  secondaryText: { color: colors.forest, fontWeight: "700", fontSize: type.small },
  pressed: { opacity: 0.85 },
  error: { color: "#8A5A4A", fontSize: type.small, textAlign: "center", marginTop: spacing.xs },

  frame: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: "#000",
    aspectRatio: 3 / 4,
  },
  camera: { flex: 1 },
  camActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ghost: {
    width: 84,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  ghostText: { color: colors.white, fontWeight: "700", fontSize: type.small },
  shutter: {
    width: 66,
    height: 66,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterDot: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.forest,
  },
});
