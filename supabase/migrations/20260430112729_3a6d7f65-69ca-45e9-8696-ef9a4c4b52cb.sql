-- Recreate view as security_invoker
DROP VIEW IF EXISTS public.public_feedback;

CREATE VIEW public.public_feedback
WITH (security_invoker = true) AS
SELECT id, rating, feedback_text, visitor_name, visitor_company, created_at
FROM public.feedback
WHERE rating >= 4;

GRANT SELECT ON public.public_feedback TO anon, authenticated;

-- Re-add SELECT policy on feedback restricted to high-rated rows (needed for invoker view)
CREATE POLICY "Public can read high-rated feedback rows"
ON public.feedback
FOR SELECT
TO anon, authenticated
USING (rating >= 4);

-- Column-level restriction: anon may only read safe columns
REVOKE SELECT ON public.feedback FROM anon;
GRANT SELECT (id, rating, feedback_text, visitor_name, visitor_company, created_at)
  ON public.feedback TO anon;

-- Tighten visitor_sessions UPDATE: replace WITH CHECK (true) with column-stable check
DROP POLICY IF EXISTS "Active sessions can be updated" ON public.visitor_sessions;

CREATE POLICY "Active sessions can be updated"
ON public.visitor_sessions
FOR UPDATE
TO public
USING (started_at > (now() - interval '24 hours'))
WITH CHECK (started_at > (now() - interval '24 hours'));