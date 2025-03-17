import AuthProvider from "@/components/AuthProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import MenuBar from "@/components/MenuBar";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
  const isProtectedRoute = (pathname: string) => {
    return pathname.startsWith("/admin") || pathname.startsWith("/");
  };

  // Check if current path is protected
  const currentPath = headers().get("x-pathname") || "/";
  console.error("session", session);
  // if (isProtectedRoute(currentPath) && !session) {
  //   console.log("Redirecting to login");
  //   redirect("/login?callbackUrl=" + encodeURIComponent(currentPath));
  // }

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* This script suppresses the specific browser extension warnings */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalConsoleError = console.error;
                console.error = function(msg) {
                  if (typeof msg === 'string' && 
                      (msg.includes('data-new-gr-c-s-check-loaded') || 
                       msg.includes('data-gr-ext-installed') ||
                       msg.includes('data-lt-installed'))) {
                    return;
                  }
                  originalConsoleError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true} className={inter.className}>
        <AuthProvider>
          <MenuBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
