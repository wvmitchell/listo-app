import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Listo",
  description:
    "Listo lets you get things done with your friends and family. Simple, fast, and fun.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <SpeedInsights />
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  )
}
