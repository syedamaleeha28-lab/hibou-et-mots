import { NextResponse } from "next/server"
import { parseSearchInput, resolveSearchResults } from "@/lib/search"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const input = parseSearchInput(Object.fromEntries(searchParams.entries()))

  try {
    const results = await resolveSearchResults(input)

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Search-Source": results.source,
      },
    })
  } catch (error) {
    console.error("Search API failed", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
