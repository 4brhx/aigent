-- ============================================================
-- AIgent Platform Database Schema
-- Supabase / PostgreSQL
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Users & Auth (extends Supabase auth.users)
-- ============================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI Models Configuration
-- ============================================================

CREATE TABLE public.models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gemini', 'claude', 'openai', 'deepseek')),
  max_tokens INTEGER NOT NULL DEFAULT 4096,
  context_window INTEGER NOT NULL DEFAULT 128000,
  cost_per_1k_input DECIMAL(10, 6) NOT NULL DEFAULT 0,
  cost_per_1k_output DECIMAL(10, 6) NOT NULL DEFAULT 0,
  capabilities TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
  avg_response_time INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Agents
-- ============================================================

CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  models TEXT[] DEFAULT '{}',
  primary_model TEXT REFERENCES public.models(id),
  system_prompt TEXT,
  temperature DECIMAL(3, 2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  memory_config JSONB DEFAULT '{"type": "conversation", "maxMessages": 50, "enabled": true}',
  tools JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_user_id ON public.agents(user_id);
CREATE INDEX idx_agents_status ON public.agents(status);

-- ============================================================
-- Conversations
-- ============================================================

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  title TEXT DEFAULT 'New Conversation',
  model TEXT REFERENCES public.models(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_agent_id ON public.conversations(agent_id);

-- ============================================================
-- Messages
-- ============================================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model TEXT,
  provider TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  cost DECIMAL(10, 6) DEFAULT 0,
  response_time INTEGER DEFAULT 0,
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- ============================================================
-- Analytics & Usage Tracking
-- ============================================================

CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  tokens_input INTEGER NOT NULL DEFAULT 0,
  tokens_output INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
  response_time INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_logs_model ON public.usage_logs(model);
CREATE INDEX idx_usage_logs_created_at ON public.usage_logs(created_at);

-- Materialized view for daily analytics
CREATE MATERIALIZED VIEW public.daily_usage AS
SELECT
  user_id,
  DATE(created_at) AS date,
  model,
  provider,
  COUNT(*) AS total_requests,
  SUM(tokens_input) AS total_tokens_input,
  SUM(tokens_output) AS total_tokens_output,
  SUM(cost) AS total_cost,
  AVG(response_time) AS avg_response_time,
  COUNT(*) FILTER (WHERE success = TRUE) * 100.0 / COUNT(*) AS success_rate
FROM public.usage_logs
GROUP BY user_id, DATE(created_at), model, provider;

CREATE UNIQUE INDEX idx_daily_usage_unique ON public.daily_usage(user_id, date, model);

-- ============================================================
-- Workflows (Agent Builder)
-- ============================================================

CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB DEFAULT '[]',
  edges JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflows_user_id ON public.workflows(user_id);

-- ============================================================
-- API Keys Management
-- ============================================================

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('gemini', 'claude', 'openai', 'deepseek')),
  encrypted_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_api_keys_user_provider ON public.api_keys(user_id, provider);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own agents" ON public.agents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own messages" ON public.messages FOR ALL USING (
  conversation_id IN (SELECT id FROM public.conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can view own usage" ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workflows" ON public.workflows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own api_keys" ON public.api_keys FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Seed Data: AI Models
-- ============================================================

INSERT INTO public.models (id, name, provider, max_tokens, context_window, cost_per_1k_input, cost_per_1k_output, capabilities, avg_response_time) VALUES
  ('gemini-2.0-flash', 'Gemini 2.0 Flash', 'gemini', 8192, 1048576, 0.000075, 0.000300, ARRAY['chat', 'code', 'reasoning', 'vision', 'function_calling', 'streaming', 'long_context'], 800),
  ('gemini-1.5-pro', 'Gemini 1.5 Pro', 'gemini', 8192, 2097152, 0.001250, 0.005000, ARRAY['chat', 'code', 'reasoning', 'vision', 'function_calling', 'streaming', 'long_context'], 2400),
  ('claude-3.5-sonnet', 'Claude 3.5 Sonnet', 'claude', 8192, 200000, 0.003000, 0.015000, ARRAY['chat', 'code', 'reasoning', 'vision', 'function_calling', 'streaming'], 1500),
  ('claude-3-opus', 'Claude 3 Opus', 'claude', 4096, 200000, 0.015000, 0.075000, ARRAY['chat', 'code', 'reasoning', 'vision', 'streaming'], 4500),
  ('gpt-4o', 'GPT-4o', 'openai', 16384, 128000, 0.002500, 0.010000, ARRAY['chat', 'code', 'reasoning', 'vision', 'function_calling', 'streaming'], 1800),
  ('gpt-4o-mini', 'GPT-4o Mini', 'openai', 16384, 128000, 0.000150, 0.000600, ARRAY['chat', 'code', 'reasoning', 'function_calling', 'streaming'], 900),
  ('deepseek-chat', 'DeepSeek Chat', 'deepseek', 8192, 128000, 0.000140, 0.000280, ARRAY['chat', 'code', 'reasoning', 'function_calling', 'streaming'], 1200),
  ('deepseek-coder', 'DeepSeek Coder', 'deepseek', 8192, 128000, 0.000140, 0.000280, ARRAY['code', 'reasoning', 'function_calling', 'streaming'], 1100);
