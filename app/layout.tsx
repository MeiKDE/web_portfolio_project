import AuthProvider from "@/components/AuthProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import MenuBar from "@/components/MenuBar";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";

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
  await getServerSession(authOptions);

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
