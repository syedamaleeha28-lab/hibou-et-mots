export type LinkGraphIssue = {
  path: string
  depth?: number
  reason: string
}

export type LinkGraphReport = {
  source: "seed" | "database"
  startPath: string
  maxDepth: number
  requiredPageCount: number
  reachablePageCount: number
  orphanCount: number
  depthViolationCount: number
  orphans: LinkGraphIssue[]
  depthViolations: LinkGraphIssue[]
  ok: boolean
}
