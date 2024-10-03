import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MarketPlace",
  description: "Showcase and sale your services",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster richColors position="top-center" />
        <Analytics />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
