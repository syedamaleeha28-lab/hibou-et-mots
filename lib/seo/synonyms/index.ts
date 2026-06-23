export {
  buildSynonymCoverageReport,
  formatSynonymCoverageReport,
  scoreSynonymCoverage,
  type SynonymCoverageReport,
  type SynonymCoverageStatus,
  type SynonymPageReport,
} from "./audit"
export { collectSynonymPageCopies, type SynonymPageCopy } from "./collect-page-copy"
export {
  detectSynonymsInText,
  MIN_SECONDARY_SYNONYMS_DEFAULT,
  MIN_SECONDARY_SYNONYMS_IMPORTANT,
  WORD_SEARCH_SYNONYMS,
  type SynonymId,
} from "./terms"
