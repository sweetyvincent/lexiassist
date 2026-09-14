# LexiAssist — AI-Powered Legal Document Analysis Platform

> **Enterprise-grade GenAI platform** for uploading, analyzing, comparing, and interrogating complex legal documents — built entirely on Google's free-tier services.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Gemini](https://img.shields.io/badge/Gemini_Flash-Free_Tier-green) ![Firebase](https://img.shields.io/badge/Firebase-Spark_Plan-orange)

---

## ✨ Features

- **📄 Smart Document Upload** — Drag-and-drop PDF upload with client-side parsing (no server upload needed)
- **🛡️ Risk Analysis** — AI-powered clause-by-clause risk assessment with radar charts and heatmaps
- **📝 Multi-Level Summaries** — Plain English, Standard, and Attorney-level document summaries
- **💬 Document Q&A** — Interactive chat with your documents using RAG (Retrieval-Augmented Generation)
- **⚖️ Contract Comparison** — Side-by-side clause comparison between two documents
- **📋 Attorney Prep Sheets** — Exportable briefing documents with checklists and key questions
- **🔒 Privacy First** — Client-side PII redaction, prompt injection defense, and user data isolation
- **🌙 Dark/Light Mode** — Full theme support with accessible, high-contrast design
- **♿ WCAG 2.1 AA** — Semantic HTML, keyboard navigation, screen reader support

---

## 🏗️ Architecture

```
Client (Next.js 14 + React)
├── PDF Upload + pdfjs-dist (client-side parsing)
├── PII Regex Scrubber (client-side)
├── IndexedDB (local document storage)
└── Split-Screen Legal Workbench
    ├── PDF Viewer (left pane)
    └── Analysis Tabs (right pane)
        ├── Summary + Reading Level Switcher
        ├── Risk Radar Chart + Clause Table
        ├── Document Comparison Diff
        ├── Interactive Q&A Chat (SSE streaming)
        └── Attorney Briefing Export
            │
            ▼
    Next.js API Routes (Server-Side)
    ├── /api/analyze — Gemini Flash structured analysis
    ├── /api/chat — SSE streaming RAG Q&A
    ├── /api/compare — Document comparison
    ├── /api/embed — Text embeddings (text-embedding-004)
    └── /api/export — Briefing generation
            │
            ▼
    ┌──────────────────────┐
    │ Google AI Studio     │ ← Gemini Flash (Free: 15 RPM)
    │ (Free Tier)          │ ← text-embedding-004
    └──────────────────────┘
            │
    ┌──────────────────────┐
    │ Cloud Firestore      │ ← User data, analyses, chat threads
    │ (Spark Plan - Free)  │ ← 1 GiB storage, 50K reads/day
    └──────────────────────┘
            │
    ┌──────────────────────┐
    │ Firebase Auth        │ ← Google OAuth + Anonymous
    │ (Free: 50K MAU)      │
    └──────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ and npm
- **Google AI Studio API Key** (free) — [Get yours here](https://aistudio.google.com/apikey)
- **Firebase Project** (Spark plan, free) — [Create one here](https://console.firebase.google.com)

### 1. Clone & Install

```bash
cd lexiassist
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Google AI Studio (server-side only — NOT prefixed with NEXT_PUBLIC_)
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Firebase (client-side — prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in providers → **Google** and **Anonymous**
4. Enable **Cloud Firestore** → Create database in **test mode** (then deploy rules)
5. Go to Project Settings → Web App → Copy config values to `.env.local`

### 4. Deploy Firestore Security Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
lexiassist/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # Server-side API routes
│   │   │   ├── analyze/        # Document analysis endpoint
│   │   │   ├── chat/           # SSE streaming Q&A
│   │   │   ├── compare/        # Document comparison
│   │   │   ├── embed/          # Text embedding
│   │   │   └── export/         # Briefing export
│   │   ├── document/[id]/      # Legal workbench page
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Landing/dashboard page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components (17)
│   │   ├── layout/             # Navbar, Sidebar, Footer
│   │   └── legal/              # Legal feature components (11)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Service layer
│   │   ├── firebase/           # Firebase Auth, Firestore
│   │   ├── gemini/             # Gemini client, prompts, legal service
│   │   ├── pdf/                # PDF parser + chunker
│   │   ├── security/           # PII scrubber, input sanitizer
│   │   └── vectors/            # In-memory vector store
│   ├── providers/              # React context providers
│   └── types/                  # TypeScript interfaces
├── firestore.rules             # Firestore security rules
├── tailwind.config.ts          # Tailwind + shadcn theme
└── vitest.config.ts            # Test configuration
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Type checking
npm run type-check
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|---------------|
| **PII Redaction** | Client-side regex scrubbing of SSNs, credit cards, phones, emails before LLM |
| **Prompt Injection** | Input pattern detection + system prompt boundaries |
| **XSS Prevention** | DOMPurify sanitization of all LLM HTML/Markdown output |
| **Data Isolation** | Firestore security rules restrict users to their own documents |
| **Secret Management** | Environment variables via `.env.local` (never committed) |
| **Local Storage** | Document binaries stored in IndexedDB (never uploaded to cloud) |

---

## 💰 Cost: $0.00

This entire platform runs within Google's free tiers:

| Service | Free Tier Limits |
|---------|-----------------|
| **Google AI Studio** | 15 RPM, 250K TPM, 1,500 RPD (Gemini Flash) |
| **Cloud Firestore** | 1 GiB storage, 50K reads/day, 20K writes/day |
| **Firebase Auth** | 50,000 Monthly Active Users |
| **Vercel Hosting** | Hobby tier (free) |

---

## ⚠️ Legal Disclaimer

**LexiAssist provides informational assistance only. It does not constitute legal advice.** Always consult a qualified attorney for professional legal guidance. AI-generated analysis may contain errors or omissions.

---

## 📄 License

MIT
