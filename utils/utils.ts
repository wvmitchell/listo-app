import { getSession } from "@auth0/nextjs-auth0"

export async function getUserID(): Promise<string> {
  const session = await getSession()
  return session?.user.sub
}

export async function getAuth0Token(): Promise<string | undefined> {
  const session = await getSession()
  return session?.accessToken
}

export const BASE_URL = process.env.BASE_URL || "http://localhost:80"
