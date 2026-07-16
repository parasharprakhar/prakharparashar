import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "submit_feedback",
  title: "Submit feedback",
  description: "Leave feedback on Prakhar's portfolio as the signed-in user. Rating is 1-5.",
  inputSchema: {
    rating: z.number().int().min(1).max(5).describe("Rating from 1 to 5"),
    feedback_text: z.string().trim().max(2000).optional().describe("Feedback message"),
    visitor_name: z.string().trim().max(120).optional(),
    visitor_company: z.string().trim().max(120).optional(),
    visitor_city: z.string().trim().max(120).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("feedback")
      .insert({
        rating: input.rating,
        feedback_text: input.feedback_text ?? null,
        visitor_name: input.visitor_name ?? ctx.getUserEmail() ?? null,
        visitor_company: input.visitor_company ?? null,
        visitor_city: input.visitor_city ?? null,
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Feedback submitted (id: ${data.id})` }],
      structuredContent: { feedback: data },
    };
  },
});
