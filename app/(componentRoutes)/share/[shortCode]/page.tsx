"use client"

import { useRouter } from "next/navigation"
import { addUserToSharedList } from "@/utils/checklistAPI"
import { useAuth } from "@/app/context/AuthContext"
import { useEffect } from "react"

type SharePageProps = {
  params: { shortCode: string }
}

const SharePage = ({ params }: SharePageProps) => {
  const shortCode = params.shortCode
  const { user, isLoading, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      addUserToSharedList(shortCode, token)
      router.push("/")
    } else {
      sessionStorage.setItem("shortCode", shortCode)
    }
  }, [user, isLoading, router, shortCode, token])

  return (
    <div>
      <h1>Someone has shared a Listo with you!</h1>
      <p>Login or Create an account to view it</p>
    </div>
  )
}

export default SharePage
