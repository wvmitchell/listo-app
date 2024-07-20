import { getChecklists } from "@/api/checklistAPI"
import { NextResponse } from "next/server"

// TODO: add wrapped routes with authentication
export async function GET() {
  const response = await getChecklists()
  return NextResponse.json(response)
}
