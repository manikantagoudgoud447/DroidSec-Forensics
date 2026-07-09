import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
export const metadata: Metadata = {
  title: "DroidSec Forensics — Android Malware Analysis Lab",
  description:
    "Professional cybersecurity forensic analysis platform for Android malware investigation. SMS-forwarding malware targeting UPI apps — static analysis, dynamic analysis, IOCs, detection rules, and forensic reporting.",
  keywords: [
    "Android Malware",
    "Forensic Analysis",
    "SMS Forwarding",
    "UPI Security",
    "YARA Rules",
    "Mobile Threat",
    "Incident Response",
    "Digital Forensics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <div className="scan-line" />
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
