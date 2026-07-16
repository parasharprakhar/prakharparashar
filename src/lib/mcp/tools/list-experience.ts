import { defineTool } from "@lovable.dev/mcp-js";
import { experience, careerTimeline } from "../../../data/portfolio";

export default defineTool({
  name: "list_experience",
  title: "List work experience",
  description: "Return Prakhar's work experience entries and career timeline.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify({ experience, careerTimeline }, null, 2) }],
    structuredContent: { experience, careerTimeline },
  }),
});
