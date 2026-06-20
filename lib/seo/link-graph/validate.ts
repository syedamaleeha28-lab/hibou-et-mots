import { ROUTES } from "@/lib/seo/routes"
import { buildDatabaseLinkGraph, listDatabaseRequiredPages } from "./build-database-graph"
import { buildSeedLinkGraph, listSeedRequiredPages } from "./build-seed-graph"
import { normalizeGraphPath } from "./paths"
import type { GraphAdjacency } from "./build-seed-graph"
import type { LinkGraphReport } from "./types"

export const DEFAULT_MAX_DEPTH = 3

export type ValidateLinkGraphOptions = {
  maxDepth?: number
  startPath?: string
  preferDatabase?: boolean
}

function measureDepths(
  adjacency: GraphAdjacency,
  startPath: string,
): Map<string, number> {
  const start = normalizeGraphPath(startPath)
  const depths = new Map<string, number>([[start, 0]])
  const queue: string[] = [start]

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentDepth = depths.get(current) ?? 0
    const neighbors = adjacency.get(current)
    if (!neighbors) continue

    for (const next of neighbors) {
      if (depths.has(next)) continue
      depths.set(next, currentDepth + 1)
      queue.push(next)
    }
  }

  return depths
}

export function validateLinkGraphFromData(input: {
  adjacency: GraphAdjacency
  requiredPages: string[]
  source: LinkGraphReport["source"]
  maxDepth?: number
  startPath?: string
}): LinkGraphReport {
  const maxDepth = input.maxDepth ?? DEFAULT_MAX_DEPTH
  const startPath = normalizeGraphPath(input.startPath ?? ROUTES.home)
  const requiredPages = [...new Set(input.requiredPages.map(normalizeGraphPath))]

  const depths = measureDepths(input.adjacency, startPath)

  const orphans = requiredPages
    .filter((path) => path !== startPath && !depths.has(path))
    .map((path) => ({ path, reason: "No inbound path from homepage within the site graph" }))

  const depthViolations = requiredPages
    .filter((path) => path !== startPath && depths.has(path))
    .filter((path) => (depths.get(path) ?? 0) > maxDepth)
    .map((path) => ({
      path,
      depth: depths.get(path),
      reason: `Page depth ${depths.get(path)} exceeds maximum ${maxDepth}`,
    }))

  const reachablePageCount = requiredPages.filter((path) => depths.has(path)).length

  return {
    source: input.source,
    startPath,
    maxDepth,
    requiredPageCount: requiredPages.length,
    reachablePageCount,
    orphanCount: orphans.length,
    depthViolationCount: depthViolations.length,
    orphans,
    depthViolations,
    ok: orphans.length === 0 && depthViolations.length === 0,
  }
}

export async function validateLinkGraph(
  options: ValidateLinkGraphOptions = {},
): Promise<LinkGraphReport> {
  const preferDatabase = options.preferDatabase ?? process.env.LINK_GRAPH_USE_DB === "true"

  if (preferDatabase) {
    const [adjacency, requiredPages] = await Promise.all([
      buildDatabaseLinkGraph(),
      listDatabaseRequiredPages(),
    ])
    if (adjacency && requiredPages) {
      return validateLinkGraphFromData({
        adjacency,
        requiredPages,
        source: "database",
        maxDepth: options.maxDepth,
        startPath: options.startPath,
      })
    }
  }

  return validateLinkGraphFromData({
    adjacency: buildSeedLinkGraph(),
    requiredPages: listSeedRequiredPages(),
    source: "seed",
    maxDepth: options.maxDepth,
    startPath: options.startPath,
  })
}

export { buildSeedLinkGraph, listSeedRequiredPages, collectHomeNavigationLinks } from "./build-seed-graph"
export { buildDatabaseLinkGraph, listDatabaseRequiredPages } from "./build-database-graph"
export type { LinkGraphReport, LinkGraphIssue } from "./types"
