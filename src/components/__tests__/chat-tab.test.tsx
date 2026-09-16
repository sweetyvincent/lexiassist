import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatTab } from '@/components/legal/chat-tab';

// Mock useChat hook
vi.mock('@/hooks/use-chat', () => ({
  useChat: (documentId: string) => ({
    messages: [
      { id: '1', role: 'user', content: 'What is the termination period?', timestamp: new Date() },
      { id: '2', role: 'assistant', content: 'The termination period is 30 days.', citations: [{ pageNumber: 2 }], timestamp: new Date() },
    ],
    isStreaming: false,
    error: null,
    sendMessage: vi.fn(),
    clearMessages: vi.fn(),
    stopStreaming: vi.fn(),
  }),
}));

describe('ChatTab Component', () => {
  it('renders chat interface with disclaimer header and messages', () => {
    render(<ChatTab documentId="doc-chat-1" documentText="Sample contract text" />);

    expect(screen.getByText(/Responses are AI-generated and not legal advice/i)).toBeInTheDocument();
    expect(screen.getByText(/What is the termination period\?/i)).toBeInTheDocument();
    expect(screen.getByText(/The termination period is 30 days./i)).toBeInTheDocument();
    expect(screen.getByText(/\[Page 2\]/i)).toBeInTheDocument();
  });

  it('renders textarea and submit button', () => {
    render(<ChatTab documentId="doc-chat-1" documentText="Sample contract text" />);

    const textarea = screen.getByPlaceholderText(/Type your question.../i);
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Does this contract have non-compete?' } });
    expect(textarea).toHaveValue('Does this contract have non-compete?');
  });
});
