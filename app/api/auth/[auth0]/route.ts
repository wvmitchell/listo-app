import {
  handleAuth,
  handleLogin,
  handleCallback,
  Session,
} from "@auth0/nextjs-auth0"
import { NextApiRequest } from "next"
import { createOrUpdateUser } from "@/utils/userAPI"

const afterCallback = (req: NextApiRequest, session: Session) => {
  // Create or update user in our database
  // return the session data
  if (session.user) {
    const { sub, email, picture } = session.user
    const token = session.accessToken || ""
    createOrUpdateUser({ sub, email, picture, token })
  }

  return session
}

// Configure handleAuth with custom callback logic
export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: "openid profile email offline_access",
    },
  }),
  callback: handleCallback({
    // The types of the afterCallback are incorrect in the library
    // causing a type error on the method signature
    //@ts-ignore
    afterCallback,
    redirectUri: process.env.AUTH0_BASE_URL,
  }),
})
