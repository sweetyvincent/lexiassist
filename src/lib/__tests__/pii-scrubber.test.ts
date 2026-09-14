import { describe, it, expect } from 'vitest';
import { piiScrubber } from '@/lib/security/pii-scrubber';

describe('PIIScrubberService', () => {
  it('detects and redacts SSN', () => {
    const text = '123-45-6789';
    const result = piiScrubber.scrub(text);
    expect(result.cleanText).toBe('[SSN REDACTED]');
    expect(piiScrubber.hasPII(text)).toBe(true);
  });

  it('detects and redacts SSN with spaces', () => {
    const text = '123 45 6789';
    expect(piiScrubber.scrub(text).cleanText).toBe('[SSN REDACTED]');
  });

  it('detects and redacts Visa credit card', () => {
    const text = '4111111111111111';
    expect(piiScrubber.scrub(text).cleanText).toBe('[CREDIT CARD REDACTED]');
  });

  it('detects and redacts Mastercard credit card', () => {
    const text = '5500000000000004';
    expect(piiScrubber.scrub(text).cleanText).toBe('[CREDIT CARD REDACTED]');
  });

  it('detects and redacts Amex credit card', () => {
    const text = '340000000000009';
    expect(piiScrubber.scrub(text).cleanText).toBe('[CREDIT CARD REDACTED]');
  });

  it('detects and redacts US phone', () => {
    const text = '(555) 123-4567';
    expect(piiScrubber.scrub(text).cleanText).toBe('[PHONE REDACTED]');
  });

  it('detects and redacts phone with dashes', () => {
    const text = '555-123-4567';
    expect(piiScrubber.scrub(text).cleanText).toBe('[PHONE REDACTED]');
  });

  it('detects and redacts phone with +1', () => {
    const text = '+1 555-123-4567';
    expect(piiScrubber.scrub(text).cleanText).toBe('[PHONE REDACTED]');
  });

  it('detects and redacts email', () => {
    const text = 'john.doe@example.com';
    expect(piiScrubber.scrub(text).cleanText).toBe('[EMAIL REDACTED]');
  });

  it('returns true when PII present', () => {
    expect(piiScrubber.hasPII('Contact me at 555-123-4567')).toBe(true);
  });

  it('returns false for clean text', () => {
    expect(piiScrubber.hasPII('Hello, this is a clean text. 2024 is the year.')).toBe(false);
  });

  it('returns correct redaction count', () => {
    const result = piiScrubber.scrub('555-123-4567 and john@example.com');
    expect(result.redactions.length).toBe(2);
  });

  it('preserves non-PII text', () => {
    const result = piiScrubber.scrub('My email is john@example.com, thanks.');
    expect(result.cleanText).toBe('My email is [EMAIL REDACTED], thanks.');
  });

  it('handles multiple PII in same text', () => {
    const result = piiScrubber.scrub('Call 555-123-4567 or email john@example.com');
    expect(result.cleanText).toBe('Call [PHONE REDACTED] or email [EMAIL REDACTED]');
  });

  it('no false positives on normal numbers', () => {
    const result = piiScrubber.scrub('The year is 2024 and quantity is 5000000.');
    expect(result.cleanText).toBe('The year is 2024 and quantity is 5000000.');
    expect(piiScrubber.hasPII('2024')).toBe(false);
  });
});
