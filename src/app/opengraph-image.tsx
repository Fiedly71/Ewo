import { ImageResponse } from "next/og";

export const alt = "Ewo · Vêtements personnalisés et collections";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#121212", color: "#f5f3ef" }}>
        <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: -4, display: "flex" }}>
          EW<span style={{ color: "#f47a1f" }}>O</span>
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 20 }}>Portez vos idées, en vrai.</div>
        <div style={{ fontSize: 30, marginTop: 20, color: "#a3a09a" }}>Vêtements personnalisés et collections, imprimés à la demande.</div>
      </div>
    ),
    size,
  );
}
