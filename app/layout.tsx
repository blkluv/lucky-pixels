import "./globals.css";
import SupabaseProvider from "../providers/SupabaseProvider";
import UserProvider from "../providers/UserProvider";
import ToasterProvider from "../providers/ToastProviders";
import localFont from "next/font/local";

const myFont = localFont({ src: "../public/Akkurat-Mono.ttf" });

export const metadata = {
  title: "Lucky pixel",
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
          {/* <ModalProvider /> */}
          <UserProvider>{children}</UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}

export default RootLayout;
