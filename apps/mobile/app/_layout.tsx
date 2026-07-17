import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@wildsnap/ui";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.canvas },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "800", color: colors.forest },
          tabBarActiveTintColor: colors.forest,
          tabBarInactiveTintColor: colors.inkFaint,
          tabBarStyle: { backgroundColor: colors.surface },
          sceneStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "WildSnap",
            tabBarLabel: "Identify",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📷</Text>,
          }}
        />
        <Tabs.Screen
          name="guide"
          options={{
            title: "My Field Guide",
            tabBarLabel: "Field Guide",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🌿</Text>,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
