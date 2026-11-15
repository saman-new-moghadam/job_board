import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://job-board-tan-two.vercel.app"),

  title: {
    default: "Job Board | Find Your Next Career Opportunity",
    template: "%s | Job Board",
  },

  description:
    "Discover job opportunities, connect with employers, and find the right career path with Job Board.",

  applicationName: "Job Board",

  openGraph: {
    type: "website",
    siteName: "Job Board",
    title: "Job Board | Find Your Next Career Opportunity",
    description:
      "Discover job opportunities and connect with employers to find your next career opportunity.",
    url: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: "Job Board | Find Your Next Career Opportunity",
    description:
      "Discover job opportunities and find your next career opportunity.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
