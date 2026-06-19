/** Strip @context from schema nodes for @graph composition. */
export function toSchemaGraphNode(
  schema: Record<string, unknown>,
): Record<string, unknown> {
  const { "@context": _context, ...node } = schema
  return node
}

export function buildSchemaGraph(
  schemas: Array<Record<string, unknown> | undefined | null>,
): Record<string, unknown> {
  const graph = schemas
    .filter((schema): schema is Record<string, unknown> => schema != null)
    .map(toSchemaGraphNode)

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}
