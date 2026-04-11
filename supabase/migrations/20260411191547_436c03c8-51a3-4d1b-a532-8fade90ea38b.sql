-- Temporary public read policies for screenshot
CREATE POLICY "temp_public_read_sessions" ON public.visitor_sessions FOR SELECT TO public USING (true);
CREATE POLICY "temp_public_read_clicks" ON public.page_clicks FOR SELECT TO public USING (true);
CREATE POLICY "temp_public_read_feedback" ON public.feedback FOR SELECT TO public USING (true);
CREATE POLICY "temp_public_read_keywords" ON public.search_keywords FOR SELECT TO public USING (true);
CREATE POLICY "temp_public_read_recruiter" ON public.recruiter_usage FOR SELECT TO public USING (true);