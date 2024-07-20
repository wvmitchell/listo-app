"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@auth0/nextjs-auth0/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "@/app/components/Header"
const queryClient = new QueryClient()

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {children}
    </QueryClientProvider>
  )
}

export default Layout
