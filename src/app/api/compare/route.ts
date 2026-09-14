import { NextResponse } from 'next/server';
import { piiScrubber } from '@/lib/security/pii-scrubber';
import { InputSanitizer } from '@/lib/security/input-sanitizer';
import { geminiLegalService } from '@/lib/gemini/legal-service';

/**
 * POST handler for document comparison
 * Expects JSON body: { textA: string, textB: string, documentAId: string, documentBId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { textA, textB, documentAId, documentBId } = body;

    if (!textA || !textB || typeof textA !== 'string' || typeof textB !== 'string') {
      return NextResponse.json({ error: 'Invalid input text' }, { status: 400 });
    }

    const cleanA = piiScrubber.scrub(InputSanitizer.sanitize(textA)).cleanText;
    const cleanB = piiScrubber.scrub(InputSanitizer.sanitize(textB)).cleanText;

    const result = await geminiLegalService.compareDocuments(cleanA, cleanB);

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
