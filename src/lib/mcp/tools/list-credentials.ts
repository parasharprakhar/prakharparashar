import { defineTool } from "@lovable.dev/mcp-js";
import { certifications, awards } from "@/data/portfolio";

export default defineTool({
  name: "list_credentials",
  title: "List certifications and awards",
  description: "Return Prakhar's certifications and awards.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify({ certifications, awards }, null, 2) }],
    structuredContent: { certifications, awards },
  }),
});
