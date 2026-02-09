import type { Metadata } from "next";
import { Geist, Geist_Mono, Kode_Mono } from "next/font/google";
import "./globals.css";
import TimeBasedGradient from "../../components/background";
import Nav from "../../components/nav";
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
// import { GeistPixelSquare } from "geist/font/pixel";
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelLine } from 'geist/font/pixel';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kodeMono = Kode_Mono({
  variable: "--font-kode-mono",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: "Josh Tregenza | Designer / Voice Actor",
  description: "Portfolio for Josh Tregenza, Australian based creative designer and voice actor",
};

const reader = createReader(process.cwd(), keystaticConfig);


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const settings = await reader.singletons.settings.read();
    const cmsMessages = settings?.tickerMessages || [];
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${kodeMono.variable} ${GeistPixelSquare.variable} ${GeistPixelLine.variable} ${GeistPixelCircle.variable} ${GeistPixelGrid.variable}`}>
      <Nav cmsMessages={cmsMessages}/>
        {children}
      <TimeBasedGradient/>
      </body>
      
    </html>
  );
}
