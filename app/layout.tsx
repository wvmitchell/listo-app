import type { Metadata } from "next"
import { UserProvider } from "@auth0/nextjs-auth0/client"
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
        <UserProvider>
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  )
}
