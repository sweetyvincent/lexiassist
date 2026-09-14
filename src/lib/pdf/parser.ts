'use client';

import type { ExtractedTextItem, ParsedPage, DocumentChunk } from '@/types/document';

/**
 * LocalPDFParser handles client-side PDF parsing and text extraction.
 */
export class LocalPDFParser {
  /**
   * Parses a PDF file buffer and extracts structured text.
   * @param fileBuffer The PDF file buffer
   * @returns Parsed pages and document metadata
   */
  public static async parse(fileBuffer: ArrayBuffer): Promise<{
    pages: ParsedPage[];
    metadata: { title?: string; author?: string; pageCount: number };
  }> {
    const pdfjs = await import('pdfjs-dist');
    if (typeof window !== 'undefined' && pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    }
    const loadingTask = pdfjs.getDocument({ data: fileBuffer });
    const pdfDoc = await loadingTask.promise;
    
    const pages: ParsedPage[] = [];
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      const items: ExtractedTextItem[] = textContent.items.map((item: any) => ({
        text: item.str,
        x: item.transform[4],
        y: item.transform[5],
        width: item.width,
        height: item.height,
        pageNumber: i,
      }));

      const pageText = items.map(item => item.text).join(' ');

      pages.push({
        pageNumber: i,
        text: pageText,
        textItems: items,
      });
    }

    const metadataData = await pdfDoc.getMetadata();
    const info = metadataData.info as any;

    return {
      pages,
      metadata: {
        title: info?.Title,
        author: info?.Author,
        pageCount: numPages,
      },
    };
  }

  /**
   * Chunks parsed PDF pages into smaller overlapping text segments.
   * @param pages The parsed PDF pages
   * @param options Chunk size and overlap options
   * @returns Array of document chunks
   */
  public static chunkText(
    pages: ParsedPage[],
    options?: { chunkSize?: number; overlap?: number }
  ): DocumentChunk[] {
    const charsPerToken = 4;
    const chunkSizeChars = (options?.chunkSize ?? 512) * charsPerToken;
    const overlapChars = (options?.overlap ?? 50) * charsPerToken;
    
    const chunks: DocumentChunk[] = [];
    
    for (const page of pages) {
      const text = page.text;
      let startIndex = 0;

      while (startIndex < text.length) {
        let endIndex = startIndex + chunkSizeChars;
        if (endIndex > text.length) {
          endIndex = text.length;
        } else {
          const lastSpace = text.lastIndexOf(' ', endIndex);
          if (lastSpace > startIndex + overlapChars) {
            endIndex = lastSpace;
          }
        }

        const chunkText = text.substring(startIndex, endIndex).trim();
        if (chunkText.length > 0) {
          chunks.push({
            id: crypto.randomUUID(),
            pageNumber: page.pageNumber,
            content: chunkText,
            startIndex,
            endIndex,
          });
        }

        const nextStart = endIndex - overlapChars;
        if (nextStart <= startIndex || endIndex >= text.length) {
          startIndex = endIndex;
        } else {
          startIndex = nextStart;
        }
      }
    }

    return chunks;
  }

  /**
   * Estimates the number of tokens in a string.
   * @param text The input string
   * @returns Estimated token count
   */
  public static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
