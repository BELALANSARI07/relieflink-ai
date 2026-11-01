import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReliefLink AI — Disaster Response & Relief Coordination Platform",
  description:
    "Intelligent emergency response ecosystem connecting government authorities, rescue teams, NGOs, hospitals, shelters, and affected citizens.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
