import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pride of Zahira | Zahira College Mawanella - Celebrating Excellence",
  description:
    "Showcasing students and alumni of Zahira College, Mawanella who have achieved excellence in curricular, co-curricular, and extra-curricular activities.",
  openGraph: {
    title: "Pride of Zahira | Zahira College Mawanella",
    description:
      "Celebrating excellence in curricular, co-curricular, and extra-curricular activities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
