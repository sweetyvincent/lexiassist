import { InputSanitizer } from '@/lib/security/input-sanitizer';
import { geminiLegalService } from '@/lib/gemini/legal-service';

export const dynamic = process.env.GITHUB_PAGES === 'true' ? 'auto' : 'force-dynamic';

/**
 * POST handler for chat streaming
 * Expects JSON body: { query: string, documentId: string, documentText: string, chunks?: {content: string, pageNumber: number}[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, documentId, documentText, chunks } = body;

    if (!query || !documentId || !documentText) {
      return new Response('Missing required fields', { status: 400 });
    }

    const sanitizedQuery = InputSanitizer.sanitize(query);
    
    if (InputSanitizer.detectPromptInjection(sanitizedQuery)) {
      return new Response('Potentially malicious input detected', { status: 400 });
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const writeEvent = (data: any) => {
      writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    };

    (async () => {
      try {
        const generator = geminiLegalService.chatWithDocument(
          sanitizedQuery, 
          chunks || [{ content: documentText }]
        );
        
        let citations: any[] = [];
        for await (const chunk of generator) {
          writeEvent({ token: chunk, done: false });
        }
        writeEvent({ token: "", done: true, citations });
      } catch (error: any) {
        writeEvent({ error: error.message || 'Stream error', done: true });
      } finally {
        writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
