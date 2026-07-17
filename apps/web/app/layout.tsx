import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { SiteBackground } from "../components/SiteBackground";

export const metadata: Metadata = {
  title: "WildSnap — your pocket field guide",
  description:
    "Point your camera at nature and collect warm, richly-detailed field-guide cards.",
};

export const viewport = {
  themeColor: "#f6f1e7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteBackground />
        <Header />
        <main
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "24px 20px 64px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
