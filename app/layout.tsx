import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseProviders from "../providers/SupabaseProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lucky pixel",
  description: "Get a piece of web",
};

interface LayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProviders>{children}</SupabaseProviders>
      </body>
    </html>
  );
}

export default RootLayout;
