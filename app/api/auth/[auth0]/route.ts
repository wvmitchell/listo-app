import { NextResponse } from "next/server"
//import { handleAuth } from "@auth0/nextjs-auth0"

//export const GET = handleAuth()

//export async function GET(req: Request, res: Response) {
//  console.log("GET request: ", req)
//  try {
//    return handleAuth()(req, res)
//  } catch (error: any) {
//    console.error(error)
//    return NextResponse.json(
//      { error: "Could not handle request" },
//      { status: 500 },
//    )
//  }
//}

export async function GET(req: Request) {
  return NextResponse.json({ body: req.url })
}
