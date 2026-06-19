type SchemaJsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function SchemaJsonLd({ data }: SchemaJsonLdProps) {
  if ("@graph" in data && !Array.isArray(data)) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    )
  }

  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  )
}
