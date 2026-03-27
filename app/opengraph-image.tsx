import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "소리 Sori — 뉴욕·뉴저지 한인 커뮤니티 & 비즈니스 디렉토리";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0F1B2D 0%, #1E3050 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 92, 92, 0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: "30%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255, 92, 92, 0.06)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#FF5C5C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            🔊
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: -2,
            }}
          >
            Sori
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          NY · NJ Korean Community & Business
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
          }}
        >
          Fort Lee · Palisades Park · Flushing · Manhattan
        </div>

        {/* Bottom pill tags */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
          }}
        >
          {["Hospital", "Lawyer", "Restaurant", "Beauty", "Real Estate"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 16,
                padding: "8px 18px",
                borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
