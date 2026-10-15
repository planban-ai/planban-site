// Canonical public facts about Planban. Page copy, head tags, and structured
// data read these values so the release version and positioning sentence are
// defined once.

export const siteOrigin = "https://planban.ai";
export const siteUrl = `${siteOrigin}/`;

/** The released Planban version shown in the header pill and structured data. */
export const planbanVersion = "2.0.0";
export const planbanReleaseUrl = `https://github.com/planban-ai/planban/releases/tag/v${planbanVersion}`;
export const planbanReleasesUrl = "https://github.com/planban-ai/planban/releases";
export const planbanRepositoryUrl = "https://github.com/planban-ai/planban";
export const planbanLicenseUrl = "https://github.com/planban-ai/planban/blob/main/LICENSE";
export const planbanXProfileUrl = "https://x.com/planbanai";

/** Owner-approved canonical description of Planban. */
export const planbanCanonicalDescription =
  "Planban is a Kanban board for you and your agents: ideas, to-dos, specs and plans in one place. It installs as a plugin in Codex and Claude Code, and your agents read it, work from it and keep it up to date.";

/** Where people sign in to online boards, and sign up for them. */
export const planbanSignInUrl = "https://app.planban.ai/sign-in";

export const planbanLogoUrl = `${siteOrigin}/assets/planban-logo-512.png`;
export const planbanSocialImageUrl = `${siteOrigin}/assets/planban-social-preview.png`;

/**
 * Structured-data feature list. Every entry must appear verbatim in the
 * rendered home page; the prerender step fails the build if one does not.
 */
export const planbanFeatureList = [
  "One board for the whole project",
  "Every Item, tracked as it happens",
  "Steer from any thread",
  "Scope and document each outcome",
  "Nothing lands until you approve it",
  "Local and agent-readable",
  "Portable references",
] as const;
