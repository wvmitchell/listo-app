"use client"

import { useEffect } from "react"
import Link from "next/link"

type ErrorProps = {
  error: Error
}

const Error = ({ error }: ErrorProps) => {
  useEffect(() => {
    // TODO: send error to logging service
    console.error(error)
  }, [error])

  return (
    <div>
      <h1>Error</h1>
      <p>
        Something went wrong. Maybe go <Link href="/">Home?</Link>
      </p>
    </div>
  )
}

export default Error
