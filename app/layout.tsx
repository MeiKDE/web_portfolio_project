import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import MenuBar from "@/components/menu-bar";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Professional Portfolio",
  description: "Build and showcase your professional portfolio",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protected routes logic
  const isProtectedRoute = (pathname) => {
    return pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  };

  // Check if current path is protected
  const currentPath = headers().get("x-pathname") || "/";

  if (isProtectedRoute(currentPath) && !session) {
    redirect("/login?callbackUrl=" + encodeURIComponent(currentPath));
  }

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
