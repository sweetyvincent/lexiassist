import { RiskLevel, ClauseCategory } from './analysis';

/**
 * Formats available for exporting briefings.
 */
export type ExportFormat = 'markdown' | 'pdf' | 'json';

/**
 * Represents an actionable item in an attorney briefing checklist.
 */
export interface ChecklistItem {
  /** Unique identifier for the item */
  id: string;
  /** Description of the action item */
  text: string;
  /** Whether the item has been completed */
  completed: boolean;
  /** Priority level of the item */
  priority: RiskLevel;
  /** Clause category this item relates to */
  category: ClauseCategory;
}

/**
 * Represents a compiled summary intended for attorney review.
 */
export interface AttorneyBriefing {
  /** Associated document ID */
  documentId: string;
  /** Title of the briefing */
  title: string;
  /** Timestamp when generated */
  generatedAt: Date;
  /** Executive summary of the legal document */
  executiveSummary: string;
  /** List of key risks to focus on */
  keyRisks: {
    title: string;
    description: string;
    riskLevel: RiskLevel;
    recommendation: string;
  }[];
  /** Action items for review */
  actionItems: ChecklistItem[];
  /** Specific questions or points to raise with an attorney */
  questionsForAttorney: string[];
  /** Tabular summary of clauses and their details */
  clauseSummaryTable: {
    clause: string;
    category: ClauseCategory;
    risk: RiskLevel;
    recommendation: string;
  }[];
  /** Full Markdown representation of the briefing */
  fullMarkdown: string;
}
