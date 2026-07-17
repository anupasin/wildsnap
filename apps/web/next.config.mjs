/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile the shared workspace packages and react-native-web.
  transpilePackages: ["@wildsnap/core", "@wildsnap/ui", "react-native-web"],
  // Next 16 runs on Turbopack by default: route `react-native` -> the web build
  // and prefer `.web.*` platform variants.
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
    },
    resolveExtensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
    ],
  },
};

export default nextConfig;
