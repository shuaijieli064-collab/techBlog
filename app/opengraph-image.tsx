import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0f172a, #0369a1)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85 }}>Tech Journal</div>
        <div style={{ marginTop: 20, fontSize: 64, fontWeight: 700 }}>{siteConfig.name}</div>
        <div style={{ marginTop: 20, fontSize: 32, opacity: 0.9 }}>{siteConfig.description}</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
