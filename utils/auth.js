"use client"

export async function login({ email, password }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/login`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (response.ok) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("jwt", data.token)
    }
    return { success: true }
  } else {
    return { success: false, message: data.message }
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("jwt")
  }
  return null
}

export function logout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("jwt")
  }
}
