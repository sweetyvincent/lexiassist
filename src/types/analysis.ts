/**
 * Represents the assessed risk level of a clause or document.
 */
export type RiskLevel = 'high' | 'medium' | 'low' | 'informational';

/**
 * Categories for classifying legal clauses.
 */
export type ClauseCategory =
  | 'termination'
  | 'liability'
  | 'indemnification'
  | 'confidentiality'
  | 'intellectual_property'
  | 'payment'
  | 'dispute_resolution'
  | 'governing_law'
  | 'force_majeure'
  | 'data_privacy'
  | 'non_compete'
  | 'warranty'
  | 'other';

/**
 * Represents reading complexity levels.
 */
export type ReadingLevel = 'plain' | 'standard' | 'attorney';

/**
 * Analysis details for a specific clause.
 */
export interface ClauseAnalysis {
  /** Unique identifier for the clause */
  clauseId: string;
  /** Short title or summary of the clause */
  title: string;
  /** The original text of the clause */
  originalText: string;
  /** Plain English simplification of the clause */
  simplifiedText: string;
  /** Legal category of the clause */
  category: ClauseCategory;
  /** The risk level associated with this clause */
  riskLevel: RiskLevel;
  /** Numeric risk score from 0 to 100 */
  riskScore: number;
  /** Detailed explanation of the analysis */
  explanation: string;
  /** Page number where the clause appears */
  pageReference: number;
  /** Paragraph or section reference */
  paragraphReference: string;
  /** Actionable recommendations based on the clause */
  recommendations: string[];
  /** Optional glossary terms identified in the clause */
  legalGlossaryTerms?: string[];
}

/**
 * Aggregate risk statistics for a specific clause category.
 */
export interface RiskCategory {
  /** The clause category */
  category: ClauseCategory;
  /** Human-readable label for the category */
  label: string;
  /** Aggregate score from 0 to 100 */
  score: number;
  /** Assessed risk level */
  riskLevel: RiskLevel;
  /** Number of clauses in this category */
  clauseCount: number;
  /** Description of the category risk */
  description: string;
}

/**
 * Complete risk analysis for a legal document.
 */
export interface RiskAnalysis {
  /** Associated document ID */
  documentId: string;
  /** Overall risk score from 0 to 100 */
  overallScore: number;
  /** Overall assessed risk level */
  overallRiskLevel: RiskLevel;
  /** Breakdown by risk categories */
  categories: RiskCategory[];
  /** Detailed analysis of individual clauses */
  clauses: ClauseAnalysis[];
  /** High-level summary of the document analysis */
  summary: string;
  /** List of key findings */
  keyFindings: string[];
  /** Document's reading complexity level */
  readingLevel: ReadingLevel;
  /** Standard legal disclaimer */
  disclaimer: string;
  /** Timestamp when the analysis was performed */
  analyzedAt: Date;
}

/**
 * Results of comparing two legal documents.
 */
export interface ComparisonResult {
  /** ID of the first document */
  documentAId: string;
  /** ID of the second document */
  documentBId: string;
  /** Array of matched clauses between documents */
  matchedClauses: {
    clauseA: ClauseAnalysis;
    clauseB: ClauseAnalysis;
    similarity: number;
    differences: string[];
  }[];
  /** Clauses present in A but missing in B */
  missingInA: ClauseAnalysis[];
  /** Clauses present in B but missing in A */
  missingInB: ClauseAnalysis[];
  /** Overall text assessment of the comparison */
  overallAssessment: string;
  /** Numeric difference in overall risk */
  riskDelta: number;
}
