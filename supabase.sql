-- ============================================
-- Zorox Portfolio — Full Database Setup
-- Idempotent — safe to run multiple times
-- ============================================

-- 1. Chat conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name text NOT NULL,
  visitor_email text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN CREATE POLICY "anon_insert_conversations" ON conversations FOR INSERT TO anon WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "anon_select_conversations" ON conversations FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_conversations" ON conversations FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_update_conversations" ON conversations FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Chat messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('visitor', 'admin')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN CREATE POLICY "anon_insert_messages" ON messages FOR INSERT TO anon WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "anon_select_messages" ON messages FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_messages" ON messages FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_insert_messages" ON messages FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "anon_select_services" ON services FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_services" ON services FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_insert_services" ON services FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_update_services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_delete_services" ON services FOR DELETE TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Experience items (timeline)
CREATE TABLE IF NOT EXISTS experience_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE experience_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "anon_select_experience" ON experience_items FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_experience" ON experience_items FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_insert_experience" ON experience_items FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_update_experience" ON experience_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_delete_experience" ON experience_items FOR DELETE TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Skills (progress bars)
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  percentage integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "anon_select_skills" ON skills FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_skills" ON skills FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_insert_skills" ON skills FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_update_skills" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_delete_skills" ON skills FOR DELETE TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. Portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  img text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  client text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "anon_select_portfolio" ON portfolio_items FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_portfolio" ON portfolio_items FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_insert_portfolio" ON portfolio_items FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_update_portfolio" ON portfolio_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_delete_portfolio" ON portfolio_items FOR DELETE TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quote text NOT NULL,
  img text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "anon_select_testimonials" ON testimonials FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_testimonials" ON testimonials FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8. Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  img text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "anon_select_blog" ON blog_posts FOR SELECT TO anon USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_select_blog" ON blog_posts FOR SELECT TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_insert_blog" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_update_blog" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "auth_delete_blog" ON blog_posts FOR DELETE TO authenticated USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- Seed data (only inserts if tables are empty)
-- ============================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM services LIMIT 1) THEN
    INSERT INTO services (title, description, icon, sort_order) VALUES
      ('Website Design', 'Building responsive, modern websites that combine beautiful design with optimal performance.', '/icon-Web-Design.png', 0),
      ('Graphic Design', 'Bringing ideas to life through stunning visuals, typography, and composition that captivate audiences.', '/icon-Design-Elements.png', 1),
      ('Branding', 'Developing cohesive brand identities that communicate your values and resonate with your target market.', '/icon-Branding.png', 2),
      ('Logo Design', 'Creating memorable logos that embody your brand essence and stand the test of time.', '/icon-Logo-Design.png', 3),
      ('UI/UX Design', 'Crafting intuitive interfaces and seamless user flows that delight users and drive engagement.', '/icon-Vector-Graphics.png', 4);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM experience_items LIMIT 1) THEN
    INSERT INTO experience_items (period, title, description, sort_order) VALUES
      ('2014-2016', 'Graphic Designer', 'Developed visual assets for print and digital media, creating compelling brand materials that helped clients establish their market presence.', 0),
      ('2017-2020', 'Website Designer', 'Designed and launched responsive websites for diverse clients, focusing on clean layouts, intuitive navigation, and conversion-driven design.', 1),
      ('2021-2025', 'UI/UX Designer', 'Led end-to-end product design for web applications, conducting user research and crafting interfaces that balance beauty with usability.', 2);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM skills LIMIT 1) THEN
    INSERT INTO skills (label, percentage, sort_order) VALUES
      ('Graphic Designer', 90, 0),
      ('UI/UX', 85, 1),
      ('Branding', 80, 2),
      ('Web Development', 75, 3);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM portfolio_items LIMIT 1) THEN
    INSERT INTO portfolio_items (title, img, sort_order) VALUES
      ('Crafting seamless and intuitive digital experiences.', '/img-work1.png', 0),
      ('Telling captivating stories through art and visuals.', '/img-work2.png', 1),
      ('Shaping a brand that stands out and resonates.', '/img-work3.png', 2),
      ('Revolutionizing the user journey with innovative designs.', '/img-work4.png', 3),
      ('Creating a logo that speaks louder than words.', '/img-work5.png', 4),
      ('Designing user-focused and accessible interfaces.', '/img-work6.png', 5);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1) THEN
    INSERT INTO testimonials (name, quote, img, sort_order) VALUES
      ('Visionary Studio', 'Working with Zorox was a game-changer. The designs exceeded our expectations and truly captured our brand vision.', '/img-client1.png', 0),
      ('Evoke Creations', 'Incredible attention to detail and a deep understanding of design principles. Every project delivered on time and beyond.', '/img-client2.png', 1),
      ('Design Mosaic', 'The creative direction and visual identity developed for us transformed how our customers perceive our brand.', '/img-client3.png', 2),
      ('Canvas Edge', 'Professional, creative, and always responsive. Zorox brought our ideas to life with stunning results.', '/img-client4.png', 3);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1) THEN
    INSERT INTO blog_posts (title, excerpt, img, sort_order) VALUES
      ('Crafting seamless and intuitive digital experiences.', 'Discover the key principles behind designing user interfaces that feel natural, reduce friction, and keep users coming back for more.', '/img-news1.png', 0),
      ('Shaping a brand that stands out and resonates.', 'Learn how strategic brand identity development can differentiate your business and create meaningful connections with your audience.', '/img-news2.png', 1);
  END IF;
END $$;
