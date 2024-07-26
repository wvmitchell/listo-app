"use server"

import { getAuth0Token } from "./sessionUtils"

export async function userExists() {
  const token = await getAuth0Token()
  const response = await fetch(`${process.env.BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return response.ok
}

export async function createUserProfile() {
  const token = await getAuth0Token()
  const response = await fetch(`${process.env.BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return response.ok
}
