import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Terminal, ShieldCheck, Wrench } from "lucide-react";

const MCP_URL = "https://qnknctdfpvlnpxbgiepf.supabase.co/functions/v1/mcp";

type ToolDoc = {
  name: string;
  title: string;
  auth: "public" | "authenticated";
  description: string;
  inputs: { name: string; type: string; required?: boolean; notes?: string }[];
  example: Record<string, unknown>;
  returns: string;
};

const tools: ToolDoc[] = [
  {
    name: "get_profile",
    title: "Get profile",
    auth: "public",
    description:
      "Returns Prakhar Parashar's professional profile summary, headline, location, and education.",
    inputs: [],
    example: {},
    returns: "{ profile, education }",
  },
  {
    name: "list_skills",
    title: "List skills",
    auth: "public",
    description: "Lists core professional competencies with related keywords.",
    inputs: [],
    example: {},
    returns: "{ skills: [{ skill, keywords[] }] }",
  },
  {
    name: "list_experience",
    title: "List work experience",
    auth: "public",
    description: "Returns work experience entries and the career timeline.",
    inputs: [],
    example: {},
    returns: "{ experience, careerTimeline }",
  },
  {
    name: "list_projects",
    title: "List key projects",
    auth: "public",
    description: "Returns flagship RPA, SAP, and digital transformation projects.",
    inputs: [],
    example: {},
    returns: "{ projects: [...] }",
  },
  {
    name: "list_credentials",
    title: "List certifications and awards",
    auth: "public",
    description: "Returns certifications and awards.",
    inputs: [],
    example: {},
    returns: "{ certifications, awards }",
  },
  {
    name: "submit_feedback",
    title: "Submit feedback",
    auth: "authenticated",
    description:
      "Leaves feedback on the portfolio as the signed-in user. Requires OAuth sign-in via the MCP client.",
    inputs: [
      { name: "rating", type: "integer 1-5", required: true },
      { name: "feedback_text", type: "string (≤ 2000 chars)" },
      { name: "visitor_name", type: "string (≤ 120 chars)" },
      { name: "visitor_company", type: "string (≤ 120 chars)" },
      { name: "visitor_city", type: "string (≤ 120 chars)" },
    ],
    example: {
      rating: 5,
      feedback_text: "Impressive RPA case studies — clear ROI framing.",
      visitor_name: "Jane Doe",
      visitor_company: "Acme Corp",
      visitor_city: "Berlin",
    },
    returns: "{ feedback: { id, rating, ... } }",
  },
];

const McpDocs = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>MCP Tools Documentation | Prakhar Parashar</title>
        <meta
          name="description"
          content="Reference for the Model Context Protocol (MCP) tools exposed by Prakhar Parashar's portfolio, including inputs and example calls."
        />
        <link rel="canonical" href="https://prakharparashar.lovable.app/mcp" />
        <meta property="og:title" content="MCP Tools Documentation | Prakhar Parashar" />
        <meta
          property="og:description"
          content="Connect ChatGPT, Claude, or Cursor to the portfolio via MCP. Full tool reference with examples."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Portfolio
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-3xl font-bold">MCP Tools Documentation</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            This portfolio exposes a Model Context Protocol (MCP) server so AI assistants like
            ChatGPT, Claude, and Cursor can query its data and (with sign-in) leave feedback.
          </p>
        </header>

        <section className="mb-10 p-5 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" /> Connect
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Add the following URL as a remote MCP server in your client. Authenticated tools
            trigger an OAuth consent flow — you'll sign in to this app to approve access.
          </p>
          <code className="block px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono break-all">
            {MCP_URL}
          </code>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Protected by Supabase OAuth 2.1 (dynamic client registration supported).
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-semibold">Available Tools</h2>

          {tools.map((tool) => (
            <article
              key={tool.name}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base font-semibold font-mono">{tool.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide ${
                    tool.auth === "authenticated"
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {tool.auth === "authenticated" ? "Auth required" : "Public"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{tool.title}</p>
              <p className="text-sm mb-4">{tool.description}</p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Inputs</p>
                {tool.inputs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No inputs.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b border-border">
                          <th className="py-1.5 pr-3 font-medium">Name</th>
                          <th className="py-1.5 pr-3 font-medium">Type</th>
                          <th className="py-1.5 font-medium">Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tool.inputs.map((i) => (
                          <tr key={i.name} className="border-b border-border/50 last:border-0">
                            <td className="py-1.5 pr-3 font-mono">{i.name}</td>
                            <td className="py-1.5 pr-3 text-muted-foreground">{i.type}</td>
                            <td className="py-1.5">{i.required ? "yes" : "no"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Example call</p>
                <pre className="px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono overflow-x-auto">
{`// In your MCP client
call_tool("${tool.name}", ${JSON.stringify(tool.example, null, 2)})`}
                </pre>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Returns</p>
                <code className="text-xs font-mono text-muted-foreground">{tool.returns}</code>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 p-5 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-semibold mb-2">Raw JSON-RPC example</h2>
          <p className="text-sm text-muted-foreground mb-3">
            All tools follow the MCP Streamable HTTP spec. Include both
            <code className="mx-1 px-1 py-0.5 rounded bg-background border border-border text-[11px] font-mono">
              application/json
            </code>
            and
            <code className="mx-1 px-1 py-0.5 rounded bg-background border border-border text-[11px] font-mono">
              text/event-stream
            </code>
            in the <code className="font-mono text-[11px]">Accept</code> header.
          </p>
          <pre className="px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono overflow-x-auto">
{`curl -X POST ${MCP_URL} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -H "Authorization: Bearer <oauth-access-token>" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": { "name": "get_profile", "arguments": {} }
  }'`}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default McpDocs;
