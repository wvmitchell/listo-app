"use client"

import { Honeybadger } from "@honeybadger-io/react"
import { useEffect } from "react"

type ErrorPageProps = {
  error: Error
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  useEffect(() => {
    Honeybadger.notify(error)
  }, [error])

  return (
    <div className="flex h-[50vh] flex-col justify-center">
      <h1 className="text-center text-2xl">
        Something went wrong! You've been logged out for security.
      </h1>
      <div className="mt-2 flex flex-row justify-center">
        <a
          href="/api/auth/logout"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-center font-semibold hover:bg-slate-50"
        >
          Login
        </a>
      </div>
    </div>
  )
}

export default ErrorPage
