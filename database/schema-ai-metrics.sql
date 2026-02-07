-- AI Agent Metrics Dashboard Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Projects Table
-- Each project represents a store/tenant
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'America/Argentina/Buenos_Aires',
  ingest_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  webhook_url TEXT,
  webhook_interval INTEGER DEFAULT 60, -- seconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Events Table
-- Stores all raw events from the AI agent
CREATE TABLE IF NOT EXISTS ai_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  conversation_id TEXT,
  channel TEXT, -- whatsapp, instagram, etc
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Widgets Configuration
-- Manages which widgets are visible and their order
CREATE TABLE IF NOT EXISTS project_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  widget_key TEXT NOT NULL,
  label TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, widget_key)
);

-- Backups Table (for future use)
CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  events_count INTEGER DEFAULT 0,
  snapshot_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_ingest_token ON projects(ingest_token);

-- AI Events indexes
CREATE INDEX IF NOT EXISTS idx_events_project_id ON ai_events(project_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON ai_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON ai_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_conversation_id ON ai_events(conversation_id);
-- Composite index for efficient metric queries
CREATE INDEX IF NOT EXISTS idx_events_project_type_date 
  ON ai_events(project_id, event_type, created_at DESC);

-- Widgets indexes
CREATE INDEX IF NOT EXISTS idx_widgets_project_id ON project_widgets(project_id);
CREATE INDEX IF NOT EXISTS idx_widgets_visible ON project_widgets(project_id, is_visible);

-- Backups indexes
CREATE INDEX IF NOT EXISTS idx_backups_project_id ON backups(project_id);
CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- For MVP, allow all operations (will be restricted later with proper auth)
CREATE POLICY "Allow all operations on projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on ai_events" ON ai_events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on project_widgets" ON project_widgets
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on backups" ON backups
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default project for testing
INSERT INTO projects (name, timezone) 
VALUES ('Demo Store', 'America/Argentina/Buenos_Aires')
ON CONFLICT DO NOTHING;

-- Insert default widgets for the first project
INSERT INTO project_widgets (project_id, widget_key, label, position, is_visible)
SELECT 
  p.id,
  widget.key,
  widget.label,
  widget.pos,
  true
FROM projects p
CROSS JOIN (
  VALUES 
    ('conversations_started', 'Conversaciones Iniciadas', 1),
    ('conversations_closed', 'Conversaciones Cerradas', 2),
    ('closure_rate', 'Tasa de Cierre', 3),
    ('human_escalations', 'Derivaciones a Humano', 4),
    ('complaints', 'Reclamos', 5),
    ('ai_purchases', 'Compras por IA', 6),
    ('payment_messages', 'Mensajería de Pagos', 7),
    ('tracking_codes', 'Códigos de Rastreo', 8),
    ('template_opens', 'Aperturas con Plantilla', 9),
    ('windows_24h', 'Ventanas 24h', 10)
) AS widget(key, label, pos)
WHERE NOT EXISTS (
  SELECT 1 FROM project_widgets WHERE project_id = p.id
)
LIMIT 10;

-- ============================================
-- EVENT TYPES REFERENCE
-- ============================================

-- Valid event_type values:
-- - conversation_started
-- - conversation_closed
-- - human_escalation
-- - complaint_created
-- - ai_purchase
-- - pending_payment_sent
-- - confirmed_payment_sent
-- - tracking_code_sent
-- - template_open
-- - window_24h_opened
