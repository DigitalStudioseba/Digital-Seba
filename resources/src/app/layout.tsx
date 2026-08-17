import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navigation from "@/components/navigation";

export const metadata: Metadata = {
  title: "Digital Seba | Resources Portal",
  description: "Access Digital Seba resources, documents, and materials",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
