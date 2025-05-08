import AuthProvider from "@/app/components/auth/AuthProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth/auth-options";
import { CertificationsProvider } from "@/context/CertificationsContext";
import { EducationsProvider } from "@/context/EducationsContext";

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
  // Pre-fetch session to hydrate the session on first render
  const session = await getServerSession(authOptions);

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
          {session?.user ? (
            <CertificationsProvider userId={session.user.id}>
              <EducationsProvider userId={session.user.id}>
                <Navbar />
                <main>{children}</main>
              </EducationsProvider>
            </CertificationsProvider>
          ) : (
            <>
              <Navbar />
              <main>{children}</main>
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
