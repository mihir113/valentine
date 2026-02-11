-- Valentine Timeline Database Schema
-- Run this in your Supabase SQL Editor

-- Create auth_config table (stores security question)
CREATE TABLE IF NOT EXISTS auth_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  security_question TEXT NOT NULL,
  security_answer TEXT NOT NULL, -- Will be hashed with bcrypt
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for sorting
CREATE INDEX IF NOT EXISTS timeline_events_date_idx ON timeline_events(date);

-- Create index on order_index
CREATE INDEX IF NOT EXISTS timeline_events_order_idx ON timeline_events(order_index);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timeline_events
DROP TRIGGER IF EXISTS update_timeline_events_updated_at ON timeline_events;
CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE auth_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access for now)
-- You can make these more restrictive based on your needs

-- Auth config - allow read for everyone (needed for login)
CREATE POLICY "Allow public read access to auth_config"
  ON auth_config FOR SELECT
  TO public
  USING (true);

-- Timeline events - allow read for everyone
CREATE POLICY "Allow public read access to timeline_events"
  ON timeline_events FOR SELECT
  TO public
  USING (true);

-- Timeline events - allow insert/update/delete for service role only
-- (Admin operations will use service role key)
CREATE POLICY "Allow service role to manage timeline_events"
  ON timeline_events FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage auth_config"
  ON auth_config FOR ALL
  TO service_role
  USING (true);

-- Create storage bucket for timeline images
INSERT INTO storage.buckets (id, name, public)
VALUES ('timeline-images', 'timeline-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read
CREATE POLICY "Allow public read access to timeline images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'timeline-images');

-- Create storage policy for authenticated upload
CREATE POLICY "Allow service role to upload timeline images"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'timeline-images');

-- Create storage policy for authenticated delete
CREATE POLICY "Allow service role to delete timeline images"
  ON storage.objects FOR DELETE
  TO service_role
  USING (bucket_id = 'timeline-images');
