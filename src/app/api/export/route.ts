import { NextResponse } from 'next/server';
import { geminiLegalService } from '@/lib/gemini/legal-service';

/**
 * POST handler for exporting legal analysis briefings
 * Expects JSON body: { analysis: RiskAnalysis, documentText: string, format: 'markdown' | 'json' }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { analysis, documentText, format } = body;

    if (!analysis || !documentText || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (format !== 'markdown' && format !== 'json') {
      return NextResponse.json({ error: 'Invalid format. Must be "markdown" or "json"' }, { status: 400 });
    }

    const briefing = await geminiLegalService.generateBriefing(analysis, documentText);

    if (format === 'markdown') {
      return new NextResponse(briefing.fullMarkdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': 'attachment; filename="legal-briefing.md"',
        },
      });
    }

    return NextResponse.json(briefing, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="legal-briefing.json"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
