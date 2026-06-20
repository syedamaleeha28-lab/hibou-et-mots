import { put } from "@vercel/blob"
import { buildPdfBlobPath } from "./content-hash"

export class PdfStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PdfStorageError"
  }
}

export async function uploadPdfBuffer(input: {
  slug: string
  hash: string
  buffer: Buffer
}): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new PdfStorageError("BLOB_READ_WRITE_TOKEN is not configured")
  }

  const pathname = buildPdfBlobPath(input.slug, input.hash)
  const result = await put(pathname, input.buffer, {
    access: "public",
    contentType: "application/pdf",
    addRandomSuffix: false,
    token,
  })

  return result.url
}
