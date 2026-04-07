
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  max_scroll_depth INTEGER DEFAULT 0,
  reached_bottom BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert sessions" ON public.visitor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own session" ON public.visitor_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Admins can read sessions" ON public.visitor_sessions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.page_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  element_type TEXT NOT NULL,
  element_label TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.page_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert clicks" ON public.page_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read clicks" ON public.page_clicks
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  visitor_name TEXT,
  visitor_city TEXT,
  visitor_company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read high-rated feedback" ON public.feedback
  FOR SELECT USING (rating >= 4);

CREATE POLICY "Admins can read all feedback" ON public.feedback
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.search_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'skill_search',
  searched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.search_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert keywords" ON public.search_keywords
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read keywords" ON public.search_keywords
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.recruiter_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_description_length INTEGER,
  match_percentage INTEGER,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recruiter_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert recruiter usage" ON public.recruiter_usage
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read recruiter usage" ON public.recruiter_usage
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_visitor_sessions_started ON public.visitor_sessions(started_at);
CREATE INDEX idx_page_clicks_clicked ON public.page_clicks(clicked_at);
CREATE INDEX idx_search_keywords_searched ON public.search_keywords(searched_at);
CREATE INDEX idx_feedback_rating ON public.feedback(rating);
