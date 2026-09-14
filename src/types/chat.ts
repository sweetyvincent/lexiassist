/**
 * Role of the participant in a chat message.
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Represents a reference to a document part used as context.
 */
export interface Citation {
  /** The page number of the citation */
  pageNumber: number;
  /** An excerpt of the cited text */
  text: string;
  /** Associated chunk identifier */
  chunkId: string;
}

/**
 * Represents a single message in a chat thread.
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** The role of the message sender */
  role: MessageRole;
  /** The text content of the message */
  content: string;
  /** Optional citations associated with the message */
  citations?: Citation[];
  /** Timestamp of the message */
  timestamp: Date;
  /** Optional flag indicating if the message is currently streaming */
  isStreaming?: boolean;
}

/**
 * Represents a complete conversation thread about a document.
 */
export interface ChatThread {
  /** Unique identifier for the thread */
  id: string;
  /** Associated document ID */
  documentId: string;
  /** ID of the user who owns the thread */
  userId: string;
  /** Title of the chat thread */
  title: string;
  /** Ordered list of messages in the thread */
  messages: ChatMessage[];
  /** Timestamp when the thread was created */
  createdAt: Date;
  /** Timestamp when the thread was last updated */
  updatedAt: Date;
}

/**
 * Represents the streaming status of a chat response.
 */
export interface StreamingState {
  /** Indicates whether content is actively streaming */
  isStreaming: boolean;
  /** The current accumulated text content */
  currentText: string;
  /**
   * Controller to abort the streaming request.
   * @internal
   */
  abortController?: AbortController;
}
