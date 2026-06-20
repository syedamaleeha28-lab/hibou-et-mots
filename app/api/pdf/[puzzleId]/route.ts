import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import {
  PdfInvalidContentError,
  PdfNotFoundError,
  resolvePuzzlePdfUrl,
} from "@/lib/pdf/service"
import { PdfStorageError } from "@/lib/pdf/storage"

export const runtime = "nodejs"
export const maxDuration = 30
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ puzzleId: string }>
}

export async function GET(request: Request, context: RouteContext) {
  const { puzzleId } = await context.params
  const sessionId = request.headers.get("x-session-id") ?? randomUUID()

  try {
    const result = await resolvePuzzlePdfUrl(puzzleId, sessionId)

    return NextResponse.redirect(result.url, {
      status: 302,
      headers: {
        "Cache-Control": result.cacheHit
          ? "public, max-age=31536000, immutable"
          : "public, max-age=3600",
        "X-Pdf-Cache": result.cacheHit ? "HIT" : "MISS",
      },
    })
  } catch (error) {
    if (error instanceof PdfNotFoundError) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 })
    }
    if (error instanceof PdfInvalidContentError) {
      return NextResponse.json({ error: error.message }, { status: 422 })
    }
    if (error instanceof PdfStorageError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    console.error("PDF generation failed", error)
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 })
  }
}
