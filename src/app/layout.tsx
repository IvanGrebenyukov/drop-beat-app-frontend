import ClientLayout from '@/app/ClientLayout'
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
  title: "DropBeat",
  description: "Music beats marketplace",
};



export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-900 text-white`}>
    <ClientLayout>
      {children}
    </ClientLayout>
    </body>
    </html>
  );
}