import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisclaimerBanner } from '@/components/legal/disclaimer-banner';

describe('DisclaimerBanner Component', () => {
  it('renders legal disclaimer notice and warning styling', () => {
    render(<DisclaimerBanner />);

    expect(screen.getByText(/Disclaimer:/i)).toBeInTheDocument();
    expect(screen.getByText(/does not provide legal advice/i)).toBeInTheDocument();
  });
});
