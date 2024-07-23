import { handleAuth } from "@auth0/nextjs-auth0"

export const GET = handleAuth({
  onError: (error: any) => {
    console.error("Auth routing error: ", error)
  },
})
