import { getSession } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"
import Image from "next/image"
import logoWithTagline from "@/app/images/full_logo_with_tagline.png"
import Auth0Link from "./auth0Link"

const LoginPage = async () => {
  const session = await getSession()
  const user = session?.user

  if (user) {
    redirect("/")
  }

  return (
    !user && (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <Image
          src={logoWithTagline}
          width={200}
          height={200}
          alt="Listo. Get it done together."
        />
        <Auth0Link />
      </div>
    )
  )
}

export default LoginPage
