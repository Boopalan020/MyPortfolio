import { ImageResponse } from "next/og";
import { contact } from "@/data/resume";

export const alt = `${contact.name} — ${contact.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0f1a",
          backgroundImage:
            "radial-gradient(circle at 82% 18%, rgba(59,167,255,0.25), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#3ba7ff",
            }}
          />
          <span style={{ fontSize: 28, color: "#3ba7ff", fontWeight: 600, letterSpacing: 1 }}>
            PORTFOLIO
          </span>
        </div>

        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#e7ecf5", marginTop: 32 }}>
          {contact.name}
        </div>

        <div style={{ display: "flex", fontSize: 40, color: "#93a1bd", marginTop: 16 }}>
          {contact.title}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 48,
          }}
        >
          {["ABAP", "BTP", "S/4HANA", "SAP CAP", "UI5"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 24,
                color: "#5fb8ff",
                background: "rgba(59,167,255,0.12)",
                border: "1px solid rgba(59,167,255,0.35)",
                borderRadius: 999,
                padding: "10px 24px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
