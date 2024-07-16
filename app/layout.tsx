import type { Metadata } from "next"
import Header from "@/app/components/Header"
import "./globals.css"

export const metadata: Metadata = {
  title: "Listo",
  description: "Checklist app built with Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
