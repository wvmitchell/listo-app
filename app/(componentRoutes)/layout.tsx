"use client"

import { AuthProvider } from "@/app/context/AuthContext"

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <AuthProvider>{children}</AuthProvider>
}
