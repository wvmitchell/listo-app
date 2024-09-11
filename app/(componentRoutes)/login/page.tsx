"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import logoWithTagline from "@/app/images/full_logo_with_tagline.png"
import LoginForm from "@/app/components/LoginForm"
import { login } from "@/utils/auth"
import { addUserToSharedList } from "@/utils/checklistAPI"
import { useAuth } from "@/app/context/AuthContext"

const LoginPage = () => {
  const { setToken } = useAuth()
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get("email") as string
    const password = data.get("password") as string
    const result = await login({
      email,
      password,
    })

    if (result.success) {
      const token = localStorage.getItem("jwt")
      const shortCode = sessionStorage.getItem("shortCode")
      if (shortCode) {
        sessionStorage.removeItem("shortCode")
        await addUserToSharedList(shortCode, token)
      }
      if (!token) return
      setToken(token)
      router.push("/")
    }
  }

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <Image
        src={logoWithTagline}
        width={200}
        height={200}
        alt="Listo. Get it done together."
      />
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
}

export default LoginPage
