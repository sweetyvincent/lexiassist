/**
 * Represents the current status of a document in the processing pipeline.
 */
export type DocumentStatus = 'uploading' | 'parsing' | 'analyzing' | 'ready' | 'error';

/**
 * A segment of a document's text used for analysis and embeddings.
 */
export interface DocumentChunk {
  /** Unique identifier for the chunk */
  id: string;
  /** The text content of the chunk */
  content: string;
  /** The page number where this chunk is located */
  pageNumber: number;
  /** Starting character index in the document */
  startIndex: number;
  /** Ending character index in the document */
  endIndex: number;
  /** Optional vector embedding representation of the chunk */
  embedding?: number[];
  /** Optional metadata associated with the chunk */
  metadata?: Record<string, unknown>;
}

/**
 * Represents an individual extracted text item with spatial coordinates.
 */
export interface ExtractedTextItem {
  /** The extracted text */
  text: string;
  /** X-coordinate on the page */
  x: number;
  /** Y-coordinate on the page */
  y: number;
  /** Width of the text bounding box */
  width: number;
  /** Height of the text bounding box */
  height: number;
  /** The page number where the text is located */
  pageNumber: number;
}

/**
 * Represents a fully parsed page from a legal document.
 */
export interface ParsedPage {
  /** The page number */
  pageNumber: number;
  /** The full text content of the page */
  text: string;
  /** Detailed layout items extracted from the page */
  textItems: ExtractedTextItem[];
}

/**
 * Represents a complete legal document within the system.
 */
export interface LegalDocument {
  /** Unique identifier for the document */
  id: string;
  /** The original file name */
  fileName: string;
  /** Size of the file in bytes */
  fileSize: number;
  /** MIME type of the file */
  mimeType: string;
  /** Timestamp when the document was uploaded */
  uploadedAt: Date;
  /** ID of the user who uploaded the document */
  userId: string;
  /** Total number of pages */
  pageCount: number;
  /** Complete extracted text from the document */
  extractedText: string;
  /** Text chunks for vector search and analysis */
  chunks: DocumentChunk[];
  /** Current processing status */
  status: DocumentStatus;
  /** Optional classification of the document type */
  documentType?: 'lease' | 'employment' | 'nda' | 'tos' | 'other';
  /** Optional identified parties in the document */
  parties?: string[];
  /** Optional effective date of the document */
  effectiveDate?: string;
  /** Optional governing law jurisdiction */
  governingLaw?: string;
}
