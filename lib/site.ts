const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

export const BASE_URL = (raw || "https://example.com").replace(/\/$/, "");
