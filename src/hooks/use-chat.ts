'use client';
import { useState, useRef } from 'react';
import type { ChatMessage, Citation } from '@/types/chat';

/**
 * Hook for managing chat interactions with legal documents
 */
export function useChat(documentId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;
    
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, message: content }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error('Chat API failed');
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable stream returned from API');

      const decoder = new TextDecoder();
      let assistantContent = '';
      
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantMessageId, role: 'assistant', content: '', timestamp: new Date() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;
        
        setMessages((prev) => 
          prev.map((m) => m.id === assistantMessageId ? { ...m, content: assistantContent } : m)
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const clearMessages = () => setMessages([]);

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return { messages, isStreaming, error, sendMessage, clearMessages, stopStreaming };
}
