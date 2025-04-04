"use client";
import { Inter } from 'next/font/google';
import '../globals.css';
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import { ABSTRAXION_CONFIG } from "../config/xion";

import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider config={ABSTRAXION_CONFIG}>
          {children}
        </AbstraxionProvider>
      </body>
    </html>
  );
}