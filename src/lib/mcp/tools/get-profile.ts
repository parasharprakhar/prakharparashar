import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { profile, education } from "../../../data/portfolio";

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description: "Return Prakhar Parashar's professional profile summary, headline, location, and education.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify({ profile, education }, null, 2) }],
    structuredContent: { profile, education },
  }),
});
