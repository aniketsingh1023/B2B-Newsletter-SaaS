import { NextResponse } from "next/server"
import { generateNewsletter } from "@/lib/alchemyst"

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}))
    const { audience, topic, tone } = json as {
      audience?: string
      topic?: string
      tone?: string
    }

    if (!audience || !topic || !tone) {
      return NextResponse.json({ error: "Missing required fields: audience, topic, tone" }, { status: 400 })
    }

    const result = await generateNewsletter({ audience, topic, tone })
    return NextResponse.json(result)
  } catch (err) {
    console.error("[api/newsletter] Error:", (err as Error).message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
