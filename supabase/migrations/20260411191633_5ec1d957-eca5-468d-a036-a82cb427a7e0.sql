-- Remove temporary public read policies
DROP POLICY IF EXISTS "temp_public_read_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "temp_public_read_clicks" ON public.page_clicks;
DROP POLICY IF EXISTS "temp_public_read_feedback" ON public.feedback;
DROP POLICY IF EXISTS "temp_public_read_keywords" ON public.search_keywords;
DROP POLICY IF EXISTS "temp_public_read_recruiter" ON public.recruiter_usage;