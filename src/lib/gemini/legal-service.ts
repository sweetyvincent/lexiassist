import { getGeminiClient, generateWithRetry, streamWithRetry } from './client';
import { 
  LEGAL_ANALYSIS_SYSTEM_PROMPT, 
  DOCUMENT_SUMMARY_PROMPTS, 
  RISK_ANALYSIS_SCHEMA, 
  RAG_QA_SYSTEM_PROMPT, 
  COMPARISON_SYSTEM_PROMPT, 
  ATTORNEY_BRIEFING_PROMPT, 
  GLOSSARY_EXPLAIN_PROMPT, 
  LEGAL_DISCLAIMER 
} from './prompts';

import { RiskAnalysis, ReadingLevel, ComparisonResult } from '@/types/analysis';
import { DocumentChunk } from '@/types/document';
import { AttorneyBriefing } from '@/types/briefing';

class GeminiLegalService {
  private getModel(modelName: string, generationConfig?: any) {
    const client = getGeminiClient();
    return client.getGenerativeModel({ model: modelName, generationConfig });
  }

  /**
   * Analyzes a document for legal risks using structured JSON output.
   */
  async analyzeDocument(text: string, docId: string): Promise<RiskAnalysis> {
    // Pseudocode: Check cache, scrub PII
    const model = this.getModel('gemini-1.5-flash', {
      responseMimeType: 'application/json',
      responseSchema: RISK_ANALYSIS_SCHEMA
    });

    const prompt = `${LEGAL_ANALYSIS_SYSTEM_PROMPT}\n\nDocument:\n${text}`;
    const result = await generateWithRetry(model, prompt);
    const responseText = result.response.text();
    
    const analysis = JSON.parse(responseText);
    // Add disclaimer handling logic
    return analysis;
  }

  /**
   * Summarizes a document based on reading level.
   */
  async summarizeDocument(text: string, level: ReadingLevel, docId: string): Promise<string> {
    const model = this.getModel('gemini-1.5-flash');
    const prompt = `${DOCUMENT_SUMMARY_PROMPTS[level]}\n\nDocument:\n${text}`;
    const result = await generateWithRetry(model, prompt);
    return result.response.text() + `\n\n${LEGAL_DISCLAIMER}`;
  }

  /**
   * Chats with document context using streaming.
   */
  async *chatWithDocument(query: string, contextChunks: DocumentChunk[]): AsyncGenerator<string> {
    const model = this.getModel('gemini-1.5-flash');
    const contextStr = contextChunks.map((c: DocumentChunk) => `Page ${c.pageNumber || '?'}: ${c.content}`).join('\n\n');
    const prompt = `${RAG_QA_SYSTEM_PROMPT}\n\nContext:\n${contextStr}\n\nQuery: ${query}`;
    
    const streamResult = await streamWithRetry(model, prompt);
    for await (const chunk of streamResult.stream) {
      yield chunk.text();
    }
    yield `\n\n${LEGAL_DISCLAIMER}`;
  }

  /**
   * Compares two documents.
   */
  async compareDocuments(textA: string, textB: string): Promise<ComparisonResult> {
    const model = this.getModel('gemini-1.5-flash');
    const prompt = `${COMPARISON_SYSTEM_PROMPT}\n\nDoc A:\n${textA}\n\nDoc B:\n${textB}`;
    const result = await generateWithRetry(model, prompt);
    const raw = result.response.text();
    try {
      return JSON.parse(raw);
    } catch {
      return {
        documentAId: 'docA',
        documentBId: 'docB',
        matchedClauses: [],
        missingInA: [],
        missingInB: [],
        overallAssessment: raw,
        riskDelta: 0,
      };
    }
  }

  /**
   * Generates an attorney briefing sheet.
   */
  async generateBriefing(analysis: RiskAnalysis, documentText: string): Promise<AttorneyBriefing> {
    const model = this.getModel('gemini-1.5-flash');
    const prompt = `${ATTORNEY_BRIEFING_PROMPT}\n\nAnalysis:\n${JSON.stringify(analysis)}\n\nDoc:\n${documentText}`;
    const result = await generateWithRetry(model, prompt);
    const raw = result.response.text();
    try {
      return JSON.parse(raw);
    } catch {
      return {
        documentId: analysis.documentId,
        title: 'Attorney Preparation Briefing',
        generatedAt: new Date(),
        executiveSummary: analysis.summary,
        keyRisks: analysis.clauses.map(c => ({
          title: c.title,
          description: c.explanation,
          riskLevel: c.riskLevel,
          recommendation: c.recommendations?.[0] || 'Review with counsel'
        })),
        actionItems: [],
        questionsForAttorney: ['Are there hidden indemnification liabilities?'],
        clauseSummaryTable: analysis.clauses.map(c => ({
          clause: c.title,
          category: c.category,
          risk: c.riskLevel,
          recommendation: c.recommendations?.[0] || 'Review'
        })),
        fullMarkdown: raw,
      };
    }
  }

  /**
   * Explains a legal term.
   */
  async explainTerm(term: string, context: string): Promise<string> {
    const model = this.getModel('gemini-1.5-flash');
    const prompt = `${GLOSSARY_EXPLAIN_PROMPT}\n\nTerm: ${term}\nContext: ${context}`;
    const result = await generateWithRetry(model, prompt);
    return result.response.text() + `\n\n${LEGAL_DISCLAIMER}`;
  }
}

export { GeminiLegalService };
export const geminiLegalService = new GeminiLegalService();
