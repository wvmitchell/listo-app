import { getAccessToken } from "@auth0/nextjs-auth0"

export async function getAuth0Token(): Promise<string | undefined> {
  const { accessToken } = await getAccessToken()
  return accessToken
}
