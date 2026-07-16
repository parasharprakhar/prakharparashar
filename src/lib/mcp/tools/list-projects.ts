import { defineTool } from "@lovable.dev/mcp-js";
import { keyProjects } from "../../../data/portfolio";

export default defineTool({
  name: "list_projects",
  title: "List key projects",
  description: "Return Prakhar's flagship RPA, SAP, and digital transformation projects.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(keyProjects, null, 2) }],
    structuredContent: { projects: keyProjects },
  }),
});
