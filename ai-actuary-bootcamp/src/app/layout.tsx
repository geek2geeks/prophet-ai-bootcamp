import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";

import { AuthProvider } from "@/lib/auth-context";
import { AiTutorWidget } from "@/components/ai-tutor-widget";
import { MigrationBanner } from "@/components/migration-banner";
import { StickyNotesWidget } from "@/components/sticky-notes-widget";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "AI Actuary Bootcamp",
  description:
    "Um workspace de aprendizagem local-first para atuarios a construir com AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        <AuthProvider>
          <SiteHeader />
          <MigrationBanner />
          {children}
          <StickyNotesWidget />
          <AiTutorWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
