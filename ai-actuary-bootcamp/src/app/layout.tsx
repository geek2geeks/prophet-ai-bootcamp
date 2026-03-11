import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { AuthProvider } from "@/lib/auth-context";
import { StudentStateProvider } from "@/lib/use-student-state";
import { MigrationBanner } from "@/components/migration-banner";
import { WorkspaceDrawer } from "@/components/workspace-drawer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Actuary Bootcamp",
  description:
    "Bootcamp local-first para transformar conhecimento atuarial em produto, prototipo e prova publica.",
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
          <StudentStateProvider>
            <SiteHeader />
            <MigrationBanner />
            {children}
            <WorkspaceDrawer />
          </StudentStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
