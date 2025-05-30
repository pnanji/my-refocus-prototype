import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ConfigProvider } from "@/components/config-panel";
import { SavedCarriersProvider } from "@/app/settings/carriers/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReFocusAI Prototype",
  description: "Prototype for ReFocusAI",
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
        <SidebarProvider>
          <ConfigProvider>
            <SavedCarriersProvider>
              {children}
            </SavedCarriersProvider>
          </ConfigProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
