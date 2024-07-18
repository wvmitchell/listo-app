import { getChecklists } from "@/api/checklistAPI"
import { NextResponse } from "next/server"

export async function GET() {
  const response = await getChecklists()
  return NextResponse.json(response)
}
