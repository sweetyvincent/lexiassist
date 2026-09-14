export interface PIIRedaction {
  type: 'ssn' | 'credit_card' | 'phone' | 'email' | 'address';
  startIndex: number;
  endIndex: number;
  replacement: string;
}

/**
 * Service to scrub Personally Identifiable Information (PII) from text.
 */
export class PIIScrubberService {
  private readonly patterns = {
    ssn: /\b\d{3}[ -]\d{2}[ -]\d{4}\b/g,
    credit_card: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|[0-9]{13,19})\b/g,
    phone: /(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\b\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    address: /\b\d+\s+([A-Za-z]+\s+)+(Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi,
  };

  /**
   * Scrubs PII from the given text and replaces it with placeholders.
   * @param text The text to scrub
   * @returns An object containing the cleaned text and the redactions made
   */
  public scrub(text: string): { cleanText: string; redactions: PIIRedaction[] } {
    let cleanText = text;
    const redactions: PIIRedaction[] = [];

    // Helper to process a pattern
    const processPattern = (
      type: PIIRedaction['type'],
      regex: RegExp,
      replacement: string
    ) => {
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        redactions.push({
          type,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          replacement,
        });
      }
    };

    processPattern('ssn', this.patterns.ssn, '[SSN REDACTED]');
    processPattern('credit_card', this.patterns.credit_card, '[CREDIT CARD REDACTED]');
    processPattern('phone', this.patterns.phone, '[PHONE REDACTED]');
    processPattern('email', this.patterns.email, '[EMAIL REDACTED]');
    processPattern('address', this.patterns.address, '[ADDRESS REDACTED]');

    redactions.sort((a, b) => b.startIndex - a.startIndex);

    for (const redaction of redactions) {
      cleanText =
        cleanText.substring(0, redaction.startIndex) +
        redaction.replacement +
        cleanText.substring(redaction.endIndex);
    }

    return { cleanText, redactions };
  }

  /**
   * Checks if the text contains any PII.
   * @param text The text to check
   * @returns True if PII is detected, false otherwise
   */
  public hasPII(text: string): boolean {
    return (
      this.patterns.ssn.test(text) ||
      this.patterns.credit_card.test(text) ||
      this.patterns.phone.test(text) ||
      this.patterns.email.test(text) ||
      this.patterns.address.test(text)
    );
  }
}

export const piiScrubber = new PIIScrubberService();
