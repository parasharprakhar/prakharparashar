import { defineTool } from "@lovable.dev/mcp-js";
import { coreCompetencies, skillKeywords } from "../../../data/portfolio";

export default defineTool({
  name: "list_skills",
  title: "List skills",
  description: "List Prakhar's core professional competencies with related keywords.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const skills = coreCompetencies.map((s) => ({ skill: s, keywords: skillKeywords[s] ?? [] }));
    return {
      content: [{ type: "text", text: JSON.stringify(skills, null, 2) }],
      structuredContent: { skills },
    };
  },
});
