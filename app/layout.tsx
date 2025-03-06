import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import MenuBar from "@/components/menu-bar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Portfolio",
  description: "Build and showcase your professional portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MenuBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
