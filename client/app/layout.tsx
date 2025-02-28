import type { Metadata } from 'next'
import './globals.css'
import MenuBar from "@/components/menu-bar"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <MenuBar />
        <main>{children}</main>
      </body>
    </html>
  )
}
