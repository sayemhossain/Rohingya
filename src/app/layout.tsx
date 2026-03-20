import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import PublicShell from "@/components/layout/PublicShell";
import QueryProvider from "@/lib/query-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rohingya in Bangladesh — Humanitarian Response",
  description:
    "Supporting Rohingya refugees in Bangladesh through education, healthcare, shelter, and sustainable solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <QueryProvider>
          <PublicShell>{children}</PublicShell>
        </QueryProvider>
      </body>
    </html>
  );
}
