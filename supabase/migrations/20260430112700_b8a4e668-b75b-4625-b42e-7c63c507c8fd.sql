-- 1. Feedback: remove public read of full table, expose limited columns via view
DROP POLICY IF EXISTS "Public can read high-rated feedback" ON public.feedback;

CREATE OR REPLACE VIEW public.public_feedback
WITH (security_invoker = true) AS
SELECT id, rating, feedback_text, visitor_name, visitor_company, created_at
FROM public.feedback
WHERE rating >= 4;

-- Allow public read of the limited view (need a permissive SELECT policy for anon on underlying rows that exposes only safe cols)
-- Since security_invoker views run with caller perms, we need a SELECT policy on feedback that returns only via the view.
-- Simpler: grant SELECT on the view and add a narrow RLS policy on feedback restricted to the safe columns (RLS is row-level not column-level), so use security_definer view instead.
DROP VIEW IF EXISTS public.public_feedback;

CREATE VIEW public.public_feedback
WITH (security_invoker = false) AS
SELECT id, rating, feedback_text, visitor_name, visitor_company, created_at
FROM public.feedback
WHERE rating >= 4;

GRANT SELECT ON public.public_feedback TO anon, authenticated;

-- 2. Realtime: remove feedback table from realtime publication (stops unrestricted broadcasts)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'feedback'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.feedback';
  END IF;
END $$;

-- 3. Visitor sessions: tighten UPDATE policy to active sessions only
DROP POLICY IF EXISTS "Anyone can update own session" ON public.visitor_sessions;

CREATE POLICY "Active sessions can be updated"
ON public.visitor_sessions
FOR UPDATE
TO public
USING (ended_at IS NULL AND started_at > (now() - interval '24 hours'))
WITH CHECK (true);

-- 4. has_role: restrict EXECUTE to authenticated users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- 5. Server-side length constraints
ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_text_length CHECK (feedback_text IS NULL OR char_length(feedback_text) <= 400),
  ADD CONSTRAINT visitor_name_length CHECK (visitor_name IS NULL OR char_length(visitor_name) <= 100),
  ADD CONSTRAINT visitor_city_length CHECK (visitor_city IS NULL OR char_length(visitor_city) <= 100),
  ADD CONSTRAINT visitor_company_length CHECK (visitor_company IS NULL OR char_length(visitor_company) <= 100),
  ADD CONSTRAINT feedback_rating_range CHECK (rating BETWEEN 1 AND 5);

ALTER TABLE public.search_keywords
  ADD CONSTRAINT search_keyword_length CHECK (char_length(keyword) <= 100),
  ADD CONSTRAINT search_source_length CHECK (char_length(source) <= 50);

ALTER TABLE public.page_clicks
  ADD CONSTRAINT page_clicks_label_length CHECK (element_label IS NULL OR char_length(element_label) <= 200),
  ADD CONSTRAINT page_clicks_type_length CHECK (char_length(element_type) <= 100);