const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://max-ai-build-log.vercel.app";

export const siteUrl = rawSiteUrl.replace(/\/$/, "");
