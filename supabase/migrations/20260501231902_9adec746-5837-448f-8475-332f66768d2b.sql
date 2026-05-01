
-- 1) Remove public SELECT on feedback (PII protection). public_feedback view remains for safe public reads.
DROP POLICY IF EXISTS "Public can read high-rated feedback rows" ON public.feedback;

-- 2) Restrict visitor_sessions updates: drop the broad public UPDATE policy and expose a SECURITY DEFINER RPC scoped by session_id.
DROP POLICY IF EXISTS "Active sessions can be updated" ON public.visitor_sessions;

CREATE OR REPLACE FUNCTION public.update_visitor_session(
  _session_id text,
  _duration_seconds integer,
  _max_scroll_depth integer,
  _reached_bottom boolean
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.visitor_sessions
  SET duration_seconds = GREATEST(COALESCE(duration_seconds, 0), COALESCE(_duration_seconds, 0)),
      max_scroll_depth = GREATEST(COALESCE(max_scroll_depth, 0), COALESCE(_max_scroll_depth, 0)),
      reached_bottom = COALESCE(reached_bottom, false) OR COALESCE(_reached_bottom, false),
      ended_at = now()
  WHERE session_id = _session_id
    AND started_at > now() - interval '24 hours';
$$;

REVOKE ALL ON FUNCTION public.update_visitor_session(text, integer, integer, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_visitor_session(text, integer, integer, boolean) TO anon, authenticated;

-- 3) Harden user_roles against privilege escalation with a restrictive policy that blocks all non-admin writes.
CREATE POLICY "Block non-admin role writes - insert"
  ON public.user_roles AS RESTRICTIVE
  FOR INSERT
  TO public
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin role writes - update"
  ON public.user_roles AS RESTRICTIVE
  FOR UPDATE
  TO public
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin role writes - delete"
  ON public.user_roles AS RESTRICTIVE
  FOR DELETE
  TO public
  USING (public.has_role(auth.uid(), 'admin'::app_role));
