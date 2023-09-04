import "./globals.css";
import SupabaseProvider from "../providers/SupabaseProvider";
import UserProvider from "../providers/UserProvider";
import ToasterProvider from "../providers/ToastProviders";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";

const myFont = localFont({ src: "../public/Akkurat-Mono.ttf" });

export const metadata = {
  title: "Lucky Pixels",
  description: "Get a piece of the internet",
};

interface LayoutProps {
  children: React.ReactNode;
}

async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>{children}</UserProvider>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout;
