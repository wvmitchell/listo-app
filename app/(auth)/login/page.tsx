import { getSession } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"
import Image from "next/image"
import logoWithTagline from "@/app/images/full_logo_with_tagline.png"

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
        <button className="mt-5 rounded-md border border-slate-500 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
          <a href="/api/auth/login">Get Started</a>
        </button>
      </div>
    )
  )
}

export default LoginPage
