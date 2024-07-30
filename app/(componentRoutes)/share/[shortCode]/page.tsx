"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/navigation"
import { addUserToSharedList } from "@/utils/checklistAPI"
import Auth0Link from "@/app/components/Auth0Link"
import { useEffect } from "react"

type SharePageProps = {
  params: { shortCode: string }
}

const SharePage = ({ params }: SharePageProps) => {
  const shortCode = params.shortCode
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      addUserToSharedList(shortCode)
      router.push("/")
    } else {
      sessionStorage.setItem("shortCode", shortCode)
    }
  }, [user, isLoading, router, shortCode])

  return (
    <div>
      <h1>Someone has shared a Listo with you!</h1>
      <p>Login or Create an account to view it</p>
      <Auth0Link />
    </div>
  )
}

export default SharePage
