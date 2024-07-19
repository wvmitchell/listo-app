import { getSession } from "@auth0/nextjs-auth0"
import { redirect } from "next/navigation"

const LoginPage = async () => {
  const session = await getSession()
  const user = session?.user

  if (user) {
    redirect("/")
  }

  return (
    !user && (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Listo</h1>
        <p className="text-sm">Master Your Tasks, Together</p>
        <button className="mt-2 rounded-md border border-slate-500 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
          <a href="/api/auth/login">Get Started</a>
        </button>
      </div>
    )
  )
}

export default LoginPage
