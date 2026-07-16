import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Loader2 } from "lucide-react";

type SupabaseOAuthAPI = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const getOauthApi = (): SupabaseOAuthAPI | null => {
  const api = (supabase.auth as any).oauth;
  return api && typeof api.getAuthorizationDetails === "function" ? api : null;
};

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const api = getOauthApi();
      if (!api) {
        setError("OAuth server is not enabled on this project yet.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: err } = await api.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    const api = getOauthApi();
    if (!api) return;
    setBusy(true);
    const { data, error: err } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "an app";
  const scopes: string[] = details?.scopes ?? details?.requested_scopes ?? [];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Helmet>
        <title>Authorize connection | Prakhar Parashar</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="w-full max-w-md p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Authorize connection</h1>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        {!error && !details && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading authorization…
          </div>
        )}

        {!error && details && (
          <>
            <p className="text-sm text-foreground mb-2">
              Connect <strong>{clientName}</strong> to Prakhar Parashar's portfolio?
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              This lets {clientName} call the portfolio's MCP tools as you. It does not bypass this
              app's permissions or backend policies.
            </p>
            {scopes.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Requested scopes</p>
                <div className="flex flex-wrap gap-1.5">
                  {scopes.map((s) => (
                    <span key={s} className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                disabled={busy}
                onClick={() => decide(true)}
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Approve
              </button>
              <button
                disabled={busy}
                onClick={() => decide(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Deny
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthConsent;
