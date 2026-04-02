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
  title: "AROHI — Association of Rural Opportunities and Human Initiatives",
  description:
    "AROHI is a non-government, non-political, nonprofit voluntary organization working for socio-economic development of disadvantaged people in Barisal Division, Bangladesh since 2002.",
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
