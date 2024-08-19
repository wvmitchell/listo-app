"use server"

import { getAuth0Token } from "./sessionUtils"
import Honeybadger from "@honeybadger-io/js"

Honeybadger.configure({
  apiKey: process.env.HONEYBADGER_API_KEY,
})

/**
 * Create or update a user in the database
 * @param user - A partial user object as returned from Auth0
 * @param user.sub - The user's Auth0 ID
 * @param user.email - The user's email address
 * @param user.picture - The user's profile picture URL
 * @param token - The access token
 * @returns The user object from the database
 * @throws the request fails
 * @example
 * ```typescript
 * const user = await createOrUpdateUser({
 *  sub: "auth0|123456",
 *  email: "someemail@example.com",
 *  picture: "https://example.com/picture.jpg"
 *  })
 *  ```
 *  */
async function createOrUpdateUser({
  sub,
  email,
  picture,
  token,
}: {
  [key: string]: string
}) {
  //const token = await getAuth0Token()
  const response = await fetch(`${process.env.BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: sub, email, picture }),
  })

  const body = await response.json()
  if (!response.ok) {
    throw new Error(body.error)
  }
  return body
}

export { createOrUpdateUser }
