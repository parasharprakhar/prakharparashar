import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import listSkills from "./tools/list-skills";
import listExperience from "./tools/list-experience";
import listProjects from "./tools/list-projects";
import listCredentials from "./tools/list-credentials";
import submitFeedback from "./tools/submit-feedback";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "prakhar-portfolio-mcp",
  title: "Prakhar Parashar Portfolio",
  version: "0.1.0",
  instructions:
    "Tools for exploring Prakhar Parashar's portfolio: profile, skills, work experience, key projects, and credentials. Authenticated users can submit feedback.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfile, listSkills, listExperience, listProjects, listCredentials, submitFeedback],
});
