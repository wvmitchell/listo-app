import type { Metadata } from "next"
import { UserProvider } from "@auth0/nextjs-auth0/client"
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
      <UserProvider>
        <body>
          <Analytics />
          <SpeedInsights />
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </body>
      </UserProvider>
    </html>
  )
}
