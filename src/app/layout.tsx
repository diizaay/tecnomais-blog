import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TecnoMais - Transforming Ideas into Innovation",
  description: "Your premium publication for AI tools, software engineering, and global technology trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#fbfbfd] text-[#1d1d1f] antialiased min-h-screen flex flex-col`}>
        {/* Navbar will go here */}
        <main className="flex-1">
          {children}
        </main>
        {/* Footer will go here */}
      </body>
    </html>
  );
}
