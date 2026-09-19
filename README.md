# ⚖️ LexiAssist — AI for Legal Assistance & Access

> **Enterprise-grade Generative AI Platform** empowering everyday users to understand, analyze, compare, and navigate complex legal documents with 3D spatial visual intelligence, cited RAG chat, and exportable attorney briefing sheets.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Vitest](https://img.shields.io/badge/Vitest-71_Tests_Passed-success) ![Gemini](https://img.shields.io/badge/Gemini_Flash-Free_Tier-green) ![License](https://img.shields.io/badge/License-MIT-purple)

---

## 🎯 Chosen Vertical: AI for Legal Assistance & Access

Legal documents—such as lease agreements, employment contracts, non-disclosure agreements, and terms of service—are notoriously complex, filled with legalese, and difficult for non-lawyers to navigate safely. **LexiAssist** bridges this accessibility gap by acting as an intelligent, context-aware legal assistant that simplifies contracts without replacing professional legal counsel.

---

## 🧠 Approach & Logic

LexiAssist employs a multi-stage, privacy-first GenAI pipeline designed for real-world legal assistance:

1. **Client-Side Document Parsing & Privacy Scrubbing**: PDFs are parsed in-browser using `pdfjs-dist`. Before sending document text to LLM APIs, an automated PII Regex Scrubber redacts SSNs, credit card numbers, email addresses, and phone numbers.
2. **Contextual RAG & Vector Storage**: Document text is chunked into semantic segments and stored in an in-memory vector database using cosine similarity embeddings for fast, citation-backed document search.
3. **Structured Legal Analysis & Decision Logic**: Leveraging Gemini 1.5 Flash structured output, LexiAssist extracts clause categories, calculates risk scores (0-100), detects auto-renewal/liability traps, and formulates context-aware action options (Option A / Option B / Option C).
4. **Interactive 3D Workbench & Accessibility Engine**: Results are presented in a dual-pane split-screen workbench with 3D spatial particle constellations, card tilt interactions, multi-language translation, Flesch-Kincaid readability scoring, text-to-speech audio, counter-clause copy assistants, and `.ics` calendar sync.

---

## ⚙️ How the Solution Works (Step-by-Step Workflow)

```
[1. Upload Contract] ──► [2. Local PII Scrubbing] ──► [3. Gemini 1.5 Flash Analysis]
                                                                  │
┌─────────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────┐
│                                             🖥️ Split-Screen Interactive Workbench                                                │
├───────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ Left Pane: PDF Document Viewer    │ Right Pane: 5 Intelligence Tabs                                                               │
│ • Multi-page document navigation  │ 1. Summary & Intelligence: Reading level switcher, Multi-language (EN/ES/FR/DE/HI), TTS,     │
│ • Jump to cited clause references │    Flesch-Kincaid Readability Score Card, Inline Jargon Glossary, Options Navigator (A/B/C) │
│ • High-contrast document zoom     │ 2. Risk Matrix: Multi-Axis Radar Chart, High/Med/Low Clause breakdown, Counter-Clause copy    │
│                                   │ 3. Comparison: Side-by-side contract diff, Standard market baseline benchmark analysis        │
│                                   │ 4. Grounded Chat: RAG Q&A with exact page/clause citations & 98% grounding confidence badges │
│                                   │ 5. Attorney Briefing: Jurisdiction selector (Delaware, CA, NY, UK), .ICS calendar sync        │
└───────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Problem Statement Alignment & Key Capabilities

LexiAssist directly implements all potential use cases outlined in the challenge framework:

| Problem Statement Use Case | LexiAssist Feature & Technical Implementation |
| :--- | :--- |
| **1. Simplifying Complex Legal Documents** | **Multi-Tier Reading Level Summarizer** (*Plain English*, *Standard Business*, *Attorney View*), **Flesch-Kincaid Readability Score Card** (Grade 18.2 ➔ Grade 8.4), **Multi-Language Selector** (English, Spanish, French, German, Hindi), **Inline Jargon Glossary**, and **Text-to-Speech (TTS)** audio narration. |
| **2. Comparing Contracts & Policies** | **Side-by-Side Comparison Matrix** with **"Load Standard Benchmark Comparison"** tool, calculating category risk score deltas (+12 risk points), redline diff summarizer, and clause variance highlights. |
| **3. Highlighting Clauses, Obligations & Risks** | **Multi-Axis Risk Radar Chart**, **Severity Breakdown (`HIGH`/`MEDIUM`/`LOW`)**, **Negotiation Counter-Clause Assistant** (1-click copy balanced clause wording), and explicit **Auto-Renewal & Liability Traps Highlighting**. |
| **4. Answering Document Questions** | **Cited RAG Q&A Chat (`ChatTab`)** featuring exact page/clause reference citations, 1-click suggested legal questions, and **98% Grounding Confidence Indicators**. |
| **5. Options & Next Steps Navigator** | **Interactive Action Navigator** guiding users through Option A (*Accept Standard Terms*), Option B (*Propose Balanced Edits*), and Option C (*Escalate to Legal Counsel*). |
| **6. Generating Checklists & Actionable Outputs** | **Contract Obligation & Deadline Checklist** with progress tracking, exportable Markdown/PDF briefing sheets, and **`.ics` Calendar File Export** for Google/Outlook calendar sync. |
| **7. Preparing for Legal Professionals** | **Structured Attorney Briefing Sheet**, **Multi-Jurisdiction Selector** (*Delaware*, *CA*, *NY*, *US Federal*, *UK*, *General Commercial*), jurisdiction notices, and prepared questions for legal counsel. |

---

## 📊 Evaluation Focus Areas & Tier Alignment

### 🔥 High Impact (Core Logic & Smart Usability)
- **Smart Dynamic Assistant**: Evaluates risk profiles, dynamically generates fair counter-clauses, and grounds Q&A answers with exact document citations.
- **Context-Aware Decision Making**: Analyzes document context to provide tailored next steps (*Option A: Accept*, *Option B: Propose Revision*, *Option C: Consult Attorney*).
- **Real-World Usability**: Supports drag-and-drop PDF parsing, offline static export fallback (GitHub Pages), audio TTS narration, `.ics` calendar sync, and instant baseline comparison data.

### ⚙️ Medium Impact (Code Quality, Security, Efficiency & Testing)
- **Code Quality & Structure**: Built with **Next.js 14 (App Router)** and strict **TypeScript 5.x** (Zero `npx tsc --noEmit` compilation errors). Modular component layout with `shadcn/ui`, `TailwindCSS`, and `Framer Motion`.
- **Security & Safety**:
  - **Client-Side PII Scrubbing**: Redacts SSNs, credit cards, emails, and phone numbers before prompt transmission (`src/lib/security/pii-scrubber.ts`).
  - **Prompt Injection Defense**: Validated system prompts and input sanitization (`src/lib/security/input-sanitizer.ts`).
  - **XSS Sanitization**: All rendered markdown content is sanitized via `isomorphic-dompurify`.
  - **"Not Legal Advice" Guardrails**: Explicit disclaimer banners across all views.
- **Efficiency & Performance**:
  - **LRU Caching**: Pre-configured dual LRU caches (`embeddingCache`, `summaryCache`, `analysisCache`).
  - **In-Memory Vector Search**: Fast cosine similarity vector search running client-side.
  - **Code Splitting**: Dynamic component imports (`next/dynamic`) for heavy libraries (`pdfjs-dist`, `recharts`).
- **Testing & Validation**:
  - **15 / 15 Test Suites Passed (71 / 71 Total Tests Passing)** via `Vitest` and `React Testing Library`.

### ✨ Low Impact (Accessibility & Visual Polish)
- **Accessibility & Inclusivity**:
  - **Multi-Language Support**: 5 languages (English, Spanish, French, German, Hindi).
  - **Readability Improvement Metrics**: Flesch-Kincaid Grade Level Before vs After.
  - **Web Speech API TTS**: Audio narrator for low literacy or visual impairments.
  - **WCAG 2.1 Compliance**: High-contrast themes, screen reader labels, and keyboard navigation.
- **Design Aesthetics**: Minimalist Luxury Emerald & Gold design system, 60fps WebGL particle constellation, card 3D tilt perspective, and glassmorphism.

---

## 💡 Assumptions Made

1. **Informational Disclaimer**: LexiAssist is designed to assist users in understanding legal documents and preparing for legal consultations; it explicitly includes disclaimers that it does not replace licensed legal advice.
2. **Browser Storage & Offline Resilience**: Operates using IndexedDB and LocalStorage fallback so user documents remain private and persistent without requiring mandatory cloud signup.
3. **Static & Server Environment Synergy**: API routes utilize Gemini 1.5 Flash via Google AI Studio API key, while static export builds (such as GitHub Pages) fall back seamlessly to rich pre-computed mock analyses for demonstration.

---

## 🧪 Running Tests & Build

```bash
# Run complete Vitest test suite (71/71 tests passing)
npm test

# Run strict TypeScript compilation check (0 errors)
npm run type-check

# Build production static export
$env:GITHUB_PAGES="true"; npm run build
```

---

## 🔗 Submission Links

- **Public GitHub Repository**: [https://github.com/sweetyvincent/lexiassist](https://github.com/sweetyvincent/lexiassist)
- **Live Application Demo**: [https://sweetyvincent.github.io/lexiassist/document/demo](https://sweetyvincent.github.io/lexiassist/document/demo)

---

## 📄 License

MIT © 2026 LexiAssist

