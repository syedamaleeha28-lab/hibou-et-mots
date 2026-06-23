export {
  buildEducationalEntityReport,
  formatEducationalEntityReport,
  scoreEducationalPage,
  type EducationalEntityReport,
  type EducationalPageReport,
} from "./audit"
export { collectEducationalPageCopies, type EducationalPageCopy } from "./collect-page-copy"
export {
  detectEducationalEntities,
  EDUCATIONAL_ENTITIES,
  MIN_ENTITIES_GRADE_PAGES,
  MIN_ENTITIES_HUB_PAGES,
  type EducationalEntityId,
} from "./terms"
