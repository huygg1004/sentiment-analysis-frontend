// src/app/layout.tsx

import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sentiment Analysis",
  description: "Sentiment Analysis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${GeistSans.variable} h-full bg-white text-black antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>

        {/* <footer className="w-full border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Huy Doan. All rights reserved.
        </footer> */}
      </body>
    </html>
  );
}
