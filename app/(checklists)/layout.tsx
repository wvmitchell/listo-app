"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "@/app/components/Header"
//import { useUser } from "@auth0/nextjs-auth0/client"
//import { useRouter } from "next/navigation"

const queryClient = new QueryClient()

const Layout = ({ children }: { children: React.ReactNode }) => {
  //const { user } = useUser()
  //const router = useRouter()

  //if (!user) {
  //  router.push("/login")
  //}

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {children}
    </QueryClientProvider>
  )
}

export default Layout
