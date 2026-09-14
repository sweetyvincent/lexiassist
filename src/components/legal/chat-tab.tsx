'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, Square, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import DOMPurify from 'dompurify';
import { useChat } from '@/hooks/use-chat';
import type { ChatMessage } from '@/types/chat';

interface ChatTabProps {
  documentId: string;
  documentText: string;
}

/**
 * Interactive Q&A Chat interface for asking questions about a legal document.
 * Uses streaming responses from the Gemini API via SSE.
 */
export function ChatTab({ documentId, documentText }: ChatTabProps) {
  const { messages, isStreaming, error, sendMessage, clearMessages, stopStreaming } = useChat(documentId);
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;
    const query = input.trim();
    setInput('');
    await sendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape' && isStreaming) {
      stopStreaming();
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  const suggestedQuestions = [
    'What are the key risks?',
    'Summarize the termination clause',
    'What are my obligations?',
    'Are there any unusual provisions?',
  ];

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden bg-background">
      {/* Disclaimer header */}
      <div className="bg-muted/30 p-2 text-center text-xs text-muted-foreground border-b">
        Ask questions about your document. Responses are AI-generated and not legal advice.
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-6">
            <div className="flex flex-col items-center">
              <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
              <p>Ask me anything about your document</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {suggestedQuestions.map((q, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 py-1.5 px-3"
                  onClick={() => handleSuggestionClick(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg: ChatMessage, idx: number) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-muted rounded-bl-none text-foreground'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  ) : (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }}
                    />
                  )}
                  {/* Citations */}
                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.citations.map((citation, ci) => (
                        <span
                          key={ci}
                          className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded cursor-pointer hover:underline"
                        >
                          [Page {citation.pageNumber}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {/* Streaming indicator */}
            {isStreaming && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2 flex space-x-1 items-center h-8">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-foreground/50 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-foreground/50 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-foreground/50 rounded-full" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="px-3 py-1 text-xs text-destructive bg-destructive/10 border-t">
          {error.message}
        </div>
      )}

      {/* Input area */}
      <div className="p-3 bg-card border-t">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="min-h-[44px] max-h-32 resize-none py-3"
            rows={1}
            aria-label="Chat message input"
          />
          {isStreaming ? (
            <Button type="button" size="icon" variant="destructive" onClick={stopStreaming} className="h-11 w-11 shrink-0">
              <Square className="h-4 w-4 fill-current" />
              <span className="sr-only">Stop generating</span>
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()} className="h-11 w-11 shrink-0">
              <SendHorizontal className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
