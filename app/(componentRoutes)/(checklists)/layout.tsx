"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "@/app/components/Header"
const queryClient = new QueryClient()

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, token, handleLogout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login")
    }
  }, [router, token, isLoading])

  if (!token) return null

  return (
    <QueryClientProvider client={queryClient}>
      <Header user={user} isLoading={isLoading} handleLogout={handleLogout} />
      {children}
    </QueryClientProvider>
  )
}

export default Layout
