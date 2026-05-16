# AIgent - Multi-Model AI Agent Platform

A premium, enterprise-grade multi-model AI agent platform built with Next.js, TypeScript, and Tailwind CSS. Features intelligent model routing, real-time analytics, and an Apple-level design system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AIgent Platform                          │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (Next.js + Tailwind + Shadcn-inspired)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Dashboard │ │   Chat   │ │  Agents  │ │Analytics │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│  State Layer (Zustand)                                      │
│  ┌──────────────────────────────────────────────────┐      │
│  │  App Store | Chat Store | Agent Store | UI Store  │      │
│  └──────────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────────┤
│  AI Service Layer                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Router  │ │ Failover │ │ Compare  │ │ Stream   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│  Model Providers                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐           │
│  │ Gemini │ │ Claude │ │ OpenAI │ │ DeepSeek │           │
│  └────────┘ └────────┘ └────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (Supabase / PostgreSQL)                         │
│  ┌─────────────────────────────────────────────────┐       │
│  │  Profiles | Agents | Conversations | Analytics  │       │
│  └─────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Multi-Model Intelligence
- **Smart Routing**: Automatically selects the best model based on task type
- **Failover**: Seamless switching to backup models on failures
- **Compare Mode**: Side-by-side response comparison across models
- **Streaming**: Real-time token streaming from all providers
- **Parallel Execution**: Run multiple models simultaneously

### AI Providers Supported
| Provider | Models | Strengths |
|----------|--------|-----------|
| Google Gemini | 2.0 Flash, 1.5 Pro | Speed, long context (1M+ tokens) |
| Anthropic Claude | 3.5 Sonnet, 3 Opus | Code, reasoning, safety |
| OpenAI | GPT-4o, GPT-4o Mini | General purpose, vision |
| DeepSeek | Chat, Coder | Cost efficiency, code |

### Premium Design System
- Apple Human Interface-inspired design
- Pure white & black theme with glass morphism
- Smooth micro-animations and transitions
- Professional dashboard architecture
- Responsive layout with collapsible sidebar

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **State**: Zustand with devtools
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel Edge Functions
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (Edge Functions)
│   │   ├── chat/          # Chat completion endpoint
│   │   ├── agents/        # Agent CRUD operations
│   │   └── analytics/     # Analytics data endpoint
│   ├── dashboard/         # Dashboard page
│   ├── chat/              # Chat workspace page
│   ├── agents/            # Agent builder page
│   └── analytics/         # Analytics page
├── components/
│   ├── ui/                # Base UI components (Button, Card, Badge, etc.)
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── dashboard/         # Dashboard-specific components
│   ├── chat/              # Chat-specific components
│   ├── agents/            # Agent builder components
│   └── analytics/         # Analytics components
├── lib/
│   ├── ai/                # AI service layer
│   │   ├── models.ts      # Model definitions & configuration
│   │   ├── router.ts      # Intelligent model routing
│   │   └── service.ts     # Multi-model API service
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── styles/
    └── globals.css        # Global styles & Tailwind layers
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/4brhx/aigent.git
cd aigent

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your API keys to .env.local
# Then start the development server
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `ANTHROPIC_API_KEY` | Yes | Anthropic Claude API key |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |

### Database Setup

```bash
# Apply the schema to your Supabase project
# Copy the contents of supabase/schema.sql to the Supabase SQL editor
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

## API Reference

### POST /api/chat
Send a message to an AI model.

```json
{
  "model": "gemini-2.0-flash",
  "messages": [
    { "role": "user", "content": "Hello, world!" }
  ],
  "temperature": 0.7,
  "maxTokens": 4096,
  "stream": false
}
```

### GET /api/analytics?range=7d
Get analytics data for the specified time range.

### POST /api/agents
Create a new agent.

## License

MIT
