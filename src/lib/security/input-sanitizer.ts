import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes input text by trimming, removing null bytes, and limiting length.
 * @param input The text to sanitize
 * @param maxLength Maximum allowed length (default: 10000)
 * @returns The sanitized string
 */
export function sanitizeInput(input: string, maxLength: number = 10000): string {
  if (!input) return '';
  let sanitized = input.replace(/\0/g, '').trim();
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
}

/**
 * Detects common prompt injection patterns in the input.
 * @param input The text to check for prompt injections
 * @returns Object indicating if suspicious and reasons
 */
export function detectPromptInjection(input: string): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const lowerInput = input.toLowerCase();

  const injectionPatterns = [
    { pattern: /ignore previous instructions/i, reason: "'Ignore previous instructions' attempt" },
    { pattern: /system:/i, reason: "System role impersonation" },
    { pattern: /you are now/i, reason: "Role-play override attempt" },
  ];

  for (const { pattern, reason } of injectionPatterns) {
    if (pattern.test(lowerInput)) {
      reasons.push(reason);
    }
  }

  const specialChars = input.match(/[^\w\s]/g);
  if (specialChars && specialChars.length > input.length * 0.3 && input.length > 20) {
    reasons.push('Excessive special characters');
  }

  if (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input) && input.length > 16) {
     reasons.push('Possible encoded instructions (base64)');
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}

/**
 * Sanitizes HTML or Markdown output from the LLM to prevent XSS.
 * @param html The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtmlOutput(html: string): string {
  return DOMPurify.sanitize(html);
}

/**
 * Validates a file type ensuring it is a supported document format.
 * @param mimeType The MIME type of the file
 * @param fileName The name of the file
 * @returns True if the file type is allowed (application/pdf)
 */
export function validateFileType(mimeType: string, fileName: string): boolean {
  return mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
}

export const InputSanitizer = {
  sanitize: sanitizeInput,
  sanitizeInput,
  detectPromptInjection,
  sanitizeHtmlOutput,
  validateFileType,
};
