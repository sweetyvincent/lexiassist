import { NextResponse } from 'next/server';
import { piiScrubber } from '@/lib/security/pii-scrubber';
import { InputSanitizer } from '@/lib/security/input-sanitizer';
import { geminiLegalService } from '@/lib/gemini/legal-service';

/**
 * POST handler for document analysis
 * Expects JSON body: { text: string, documentId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, documentId } = body;

    if (!text || typeof text !== 'string' || text.length === 0 || text.length > 100000) {
      return NextResponse.json({ error: 'Invalid input text' }, { status: 400 });
    }
    
    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    const sanitizedText = InputSanitizer.sanitize(text);
    const scrubbed = piiScrubber.scrub(sanitizedText);

    const result = await geminiLegalService.analyzeDocument(scrubbed.cleanText, documentId);

    return NextResponse.json(result, { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    if (error?.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
