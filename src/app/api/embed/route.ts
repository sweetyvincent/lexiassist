import { NextResponse } from 'next/server';
import { generateEmbeddings } from '@/lib/gemini/client';

/**
 * POST handler for embedding generation
 * Expects JSON body: { chunks: string[] }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chunks } = body;

    if (!Array.isArray(chunks) || chunks.length > 100) {
      return NextResponse.json(
        { error: 'Invalid chunks array. Maximum 100 chunks allowed.' }, 
        { status: 400 }
      );
    }

    for (const chunk of chunks) {
      if (typeof chunk !== 'string' || chunk.length > 10000) {
        return NextResponse.json(
          { error: 'Invalid chunk size. Maximum 10000 characters per chunk.' }, 
          { status: 400 }
        );
      }
    }

    const embeddings = await generateEmbeddings(chunks);

    return NextResponse.json({ embeddings }, { 
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
