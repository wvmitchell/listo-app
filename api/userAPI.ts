"use server"

// base url is the environment variable BASE_URL or http://localhost:3000
const BASE_URL = process.env.BASE_URL || "http://localhost:8080"

export async function getUserInfo(userID: string) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // TODO: replace with actual user ID
      userID,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to get user info: ${res.status}`)
  }

  return await res.json()
}

export async function createUser(userID: string) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // TODO: replace with actual user ID
      userID,
    }
  })

  if (!res.ok) {
    throw new Error(`Failed to create user: ${res.status}`)
  }

  return await res.json()
}
