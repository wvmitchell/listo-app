"use server"

import Honeybadger from "@honeybadger-io/js"

Honeybadger.configure({
  apiKey: process.env.HONEYBADGER_API_KEY,
})

async function getCurrentUser() {
  const response = await fetch(`${process.env.BASE_URL}/users/me`, {
    credentials: "include",
  })
  const body = await response.json()

  if (!response.ok) {
    throw new Error(body.error)
  }
  return body
}

async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const response = await fetch(`${process.env.BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })

  const body = await response.json()
  if (!response.ok) {
    throw new Error(body.error)
  }
  return body
}

export { getCurrentUser, loginUser }
