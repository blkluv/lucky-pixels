import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseProvider from "../providers/SupabaseProvider";
import UserProvider from "../providers/UserProvider";
import ModalProvider from "../providers/ModalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lucky pixel",
  description: "Get a piece of web",
};

interface LayoutProps {
  children: React.ReactNode;
}

async function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {/* <ModalProvider /> */}
          <UserProvider>{children}</UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

export default RootLayout;
