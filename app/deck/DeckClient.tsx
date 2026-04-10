"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

const SLIDES = [
  { id: "cover" },
  { id: "problem" },
  { id: "market" },
  { id: "solution" },
  { id: "revenue" },
  { id: "gtm" },
  { id: "competitive" },
  { id: "team" },
  { id: "ask" },
];

/* ─────────────────────────────────────────────────────────────────
   TOKEN MAP — all colors controlled here
───────────────────────────────────────────────────────────────── */
function tokens(dark: boolean) {
  return {
    bg: dark ? "#0D0D0D" : "#FFFFFF",
    bgAlt: dark ? "#141414" : "#F7F7F7",
    text: dark ? "#F2F2F2" : "#111111",
    sub: dark ? "#888888" : "#777777",
    border: dark ? "#2A2A2A" : "#E8E8E8",
    accent: "#FF5C5C",
    accentBg: dark ? "rgba(255,92,92,0.10)" : "rgba(255,92,92,0.07)",
    white: dark ? "#F2F2F2" : "#111111",
    chip: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    chipText: dark ? "#999999" : "#666666",
    tableHead: dark ? "#1A1A1A" : "#F2F2F2",
    rowAlt: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    highlight: dark ? "rgba(255,92,92,0.10)" : "rgba(255,92,92,0.05)",
  };
}

/* ─────────────────────────────────────────────────────────────────
   SHARED LAYOUT
───────────────────────────────────────────────────────────────── */
function SlideWrap({
  children,
  dark,
  alt = false,
}: {
  children: React.ReactNode;
  dark: boolean;
  alt?: boolean;
}) {
  const t = tokens(dark);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: alt ? t.bgAlt : t.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(28px, 5vw, 72px) clamp(24px, 6vw, 88px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function SlideLabel({
  n,
  label,
  dark,
}: {
  n: string;
  label: string;
  dark: boolean;
}) {
  const t = tokens(dark);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: "clamp(18px,3vw,32px)",
      }}
    >
      <span
        style={{
          fontFamily: "Pretendard, sans-serif",
          fontSize: "clamp(10px,1vw,12px)",
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: t.sub,
          textTransform: "uppercase" as const,
        }}
      >
        {n}
      </span>
      <span
        style={{
          width: 1,
          height: 12,
          background: t.border,
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontFamily: "Pretendard, sans-serif",
          fontSize: "clamp(10px,1vw,12px)",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: t.accent,
          textTransform: "uppercase" as const,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SlideTitleBlock({
  title,
  sub,
  dark,
}: {
  title: React.ReactNode;
  sub?: string;
  dark: boolean;
}) {
  const t = tokens(dark);
  return (
    <div style={{ marginBottom: "clamp(20px,3vw,40px)" }}>
      <h2
        style={{
          fontFamily: "Pretendard, sans-serif",
          fontSize: "clamp(1.65rem,3.5vw,3.2rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: t.text,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: "clamp(0.85rem,1.3vw,1rem)",
            color: t.sub,
            marginTop: 10,
            fontWeight: 400,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 01 — COVER
───────────────────────────────────────────────────────────────── */
function SlideCover({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  return (
    <SlideWrap dark={dark}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-2%",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "Pretendard, sans-serif",
          fontSize: "clamp(200px,30vw,480px)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.045)",
          userSelect: "none" as const,
          pointerEvents: "none" as const,
        }}
      >
        소리
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
        <div
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: "clamp(3rem, 9vw, 8.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: t.accent,
            marginBottom: "clamp(8px,1.2vw,18px)",
          }}
        >
          소리
        </div>

        <div
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: "clamp(0.8rem,1.5vw,1.35rem)",
            fontWeight: 600,
            letterSpacing: "0.35em",
            textTransform: "uppercase" as const,
            color: t.sub,
            marginBottom: "clamp(20px,3vw,40px)",
          }}
        >
          SORI
        </div>

        <div
          style={{
            width: "clamp(32px,4vw,52px)",
            height: 2,
            background: t.border,
            marginBottom: "clamp(20px,3vw,40px)",
          }}
        />

        <div
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: "clamp(1rem,2vw,1.6rem)",
            fontWeight: 700,
            color: t.text,
            marginBottom: "clamp(6px,0.8vw,12px)",
          }}
        >
          미국 한인 커뮤니티 & 비즈니스 플랫폼
        </div>
        <div
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: "clamp(0.8rem,1.2vw,1rem)",
            color: t.sub,
            marginBottom: "clamp(24px,3.5vw,48px)",
            lineHeight: 1.8,
          }}
        >
          소리는 &apos;목소리&apos;에서 온 이름입니다.
          <br />
          미국 전역 한인들이 만들어가는 커뮤니티.
        </div>

        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
          {["oursori.com", "NY / NJ → USA", "Seed Round 2025", "Consumer · SaaS"].map((l) => (
            <span
              key={l}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "clamp(10px,1vw,13px)",
                fontWeight: 600,
                padding: "6px 14px",
                border: `1px solid ${t.border}`,
                borderRadius: 4,
                color: t.sub,
                background: t.chip,
                letterSpacing: "0.02em",
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 02 — PROBLEM
───────────────────────────────────────────────────────────────── */
function SlideProblem({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const problems = [
    { n: "01", title: "모바일 없음", body: "Heykorean 등 주요 한인 플랫폼, 모바일 앱 전무. 2024년에도 PC 전용." },
    { n: "02", title: "Gen 1.5 · 2세 이탈", body: "영어권 한인 2세대가 사용하지 않는 플랫폼." },
    { n: "03", title: "광고 효율 0%", body: "타겟 없는 배너 광고. 전문직 비즈니스 수요 미충족." },
    { n: "04", title: "신뢰 검증 없음", body: "한인 의사·변호사 찾기. 검증된 정보 없이 입소문에 의존." },
  ];

  return (
    <SlideWrap dark={dark} alt>
      <SlideLabel n="01" label="The Problem" dark={dark} />
      <SlideTitleBlock
        title={<>한인 커뮤니티는 성장했지만<br /><span style={{ color: t.sub, fontWeight: 400 }}>플랫폼은 멈춰있다</span></>}
        dark={dark}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(8px,1.5vw,20px)" }}>
        {problems.map((p) => (
          <div key={p.n} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: "clamp(14px,2vw,28px)" }}>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(10px,1vw,12px)", fontWeight: 700, color: t.sub, letterSpacing: "0.14em", marginBottom: 12 }}>{p.n}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.85rem,1.4vw,1.1rem)", fontWeight: 700, color: t.text, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1.1vw,0.9rem)", color: t.sub, lineHeight: 1.65 }}>{p.body}</div>
          </div>
        ))}
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 03 — MARKET SIZE
───────────────────────────────────────────────────────────────── */
function SlideMarket({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const markets = [
    { label: "TAM", num: "2,000,000", unit: "명", sub: "미국 전체 한인", src: "U.S. Census 2020", hi: false },
    { label: "SAM", num: "600,000", unit: "명", sub: "NY·NJ·CA 집중거주", src: "ACS 집계 기준", hi: false },
    { label: "SOM", num: "120,000", unit: "명", sub: "NY/NJ 20-50대", src: "1차 타겟 (Y1)", hi: true },
  ];

  return (
    <SlideWrap dark={dark}>
      <SlideLabel n="02" label="Market Size" dark={dark} />
      <SlideTitleBlock title={<>충분히 크고,<br /><span style={{ color: t.sub, fontWeight: 400 }}>아무도 제대로 안 하고 있다</span></>} dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(8px,1.5vw,20px)", marginBottom: "clamp(16px,2.5vw,32px)" }}>
        {markets.map((m) => (
          <div
            key={m.label}
            style={{
              border: `1px solid ${m.hi ? t.accent : t.border}`,
              borderRadius: 8,
              padding: "clamp(18px,2.5vw,36px) clamp(14px,2vw,28px)",
              background: m.hi ? t.highlight : t.bgAlt,
              textAlign: "center" as const,
            }}
          >
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(10px,1vw,12px)", fontWeight: 800, letterSpacing: "0.22em", color: m.hi ? t.accent : t.sub, textTransform: "uppercase" as const, marginBottom: 14 }}>{m.label}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(2rem,5vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: m.hi ? t.accent : t.text }}>{m.num}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.7rem,1vw,0.85rem)", color: t.sub, marginTop: 4, marginBottom: 14 }}>{m.unit}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.78rem,1.1vw,0.92rem)", fontWeight: 600, color: t.text, marginBottom: 4 }}>{m.sub}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.68rem,0.9vw,0.78rem)", color: t.sub }}>{m.src}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, border: `1px solid ${t.border}`, borderRadius: 6, padding: "clamp(10px,1.5vw,18px) clamp(14px,2vw,26px)", background: t.bgAlt }}>
        <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1rem,1.8vw,1.5rem)", fontWeight: 900, color: t.accent }}>$50 – 100M</span>
        <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.78rem,1vw,0.9rem)", color: t.sub }}>한인 전문직 광고 시장 추정 / 년</span>
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 04 — SOLUTION
───────────────────────────────────────────────────────────────── */
function SlideSolution({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const pillars = [
    { n: "01", title: "커뮤니티", en: "Community", items: ["뉴스 & 게시판", "중고거래", "이벤트 캘린더", "커뮤니티 피드"] },
    { n: "02", title: "비즈니스 디렉토리", en: "Directory", items: ["한인 병원 · 치과", "변호사 · 회계사", "식당 · 뷰티", "이민 · 유학"], hi: true },
    { n: "03", title: "광고 플랫폼", en: "Ad Platform", items: ["비즈니스 대시보드", "해외 채용 보드", "프리미엄 리스팅", "분석 & 리포트"] },
  ];

  return (
    <SlideWrap dark={dark} alt>
      <SlideLabel n="03" label="The Solution" dark={dark} />
      <SlideTitleBlock title={<>소리 — 미국 한인의 모든 것이 모이는 곳</>} dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(8px,1.5vw,20px)" }}>
        {pillars.map((p) => (
          <div key={p.n} style={{ background: t.bg, border: `1px solid ${p.hi ? t.accent : t.border}`, borderRadius: 8, padding: "clamp(18px,2.5vw,32px) clamp(14px,2vw,26px)", position: "relative" as const }}>
            <div aria-hidden style={{ position: "absolute" as const, top: 16, right: 18, fontFamily: "Pretendard, sans-serif", fontSize: "clamp(22px,3vw,42px)", fontWeight: 900, color: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", lineHeight: 1, letterSpacing: "-0.04em", userSelect: "none" as const }}>{p.n}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.7rem,0.9vw,0.8rem)", fontWeight: 600, color: p.hi ? t.accent : t.sub, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>{p.en}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1rem,1.8vw,1.4rem)", fontWeight: 800, color: t.text, marginBottom: "clamp(14px,2vw,22px)", lineHeight: 1.2 }}>{p.title}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {p.items.map((item) => (
                <li key={item} style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.78rem,1.1vw,0.9rem)", color: t.sub, padding: "7px 0", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: p.hi ? t.accent : t.sub, flexShrink: 0 }} />{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 05 — REVENUE
───────────────────────────────────────────────────────────────── */
function SlideRevenue({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const rows = [
    { src: "비즈니스 기본 광고", price: "$99–299/월", target: "~500 비즈니스", arr: "$150K", hi: false },
    { src: "프리미엄 리스팅 (병원·변호사·회계사)", price: "$499–999/월", target: "~25 전문직", arr: "$200K", hi: true },
    { src: "해외 채용 보드", price: "$199–499/건", target: "~200 포스팅", arr: "$50K", hi: false },
    { src: "스폰서십 / CPM", price: "CPM 기반", target: "기업 광고주", arr: "$50K", hi: false },
  ];
  const colStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "2.2fr 1fr 1.2fr 0.9fr" };

  return (
    <SlideWrap dark={dark}>
      <SlideLabel n="04" label="Revenue Model" dark={dark} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: "clamp(18px,2.5vw,32px)", flexWrap: "wrap" as const }}>
        <h2 style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1.65rem,3.5vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: t.text, margin: 0 }}>Y1 목표</h2>
        <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1.6rem,3.2vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: t.accent }}>$450K ARR</span>
      </div>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ ...colStyle, background: t.tableHead, padding: "clamp(10px,1.2vw,16px) clamp(12px,2vw,24px)", gap: 12 }}>
          {["수익원", "단가", "목표 고객수", "Y1 ARR"].map((h) => (
            <div key={h} style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", fontWeight: 800, letterSpacing: "0.14em", color: t.sub, textTransform: "uppercase" as const }}>{h}</div>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.src} style={{ ...colStyle, padding: "clamp(11px,1.5vw,18px) clamp(12px,2vw,24px)", borderTop: `1px solid ${t.border}`, alignItems: "center", gap: 12, background: row.hi ? t.highlight : "transparent" }}>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.8rem,1.2vw,0.92rem)", color: t.text, fontWeight: row.hi ? 700 : 400 }}>{row.src}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1.1vw,0.88rem)", color: t.sub }}>{row.price}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1.1vw,0.88rem)", color: t.sub }}>{row.target}</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.85rem,1.3vw,1rem)", fontWeight: 800, color: row.hi ? t.accent : t.text }}>{row.arr}</div>
          </div>
        ))}
        <div style={{ ...colStyle, padding: "clamp(11px,1.5vw,18px) clamp(12px,2vw,24px)", borderTop: `1px solid ${t.border}`, background: t.bgAlt, gap: 12 }}>
          <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.8rem,1.2vw,0.95rem)", fontWeight: 800, color: t.text }}>합계 — Year 1 목표</div>
          <div /><div />
          <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.9rem,1.4vw,1.1rem)", fontWeight: 900, color: t.accent }}>$450K ARR</div>
        </div>
      </div>
      <div style={{ marginTop: "clamp(12px,1.8vw,22px)", fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1vw,0.88rem)", color: t.sub, borderLeft: `3px solid ${t.border}`, paddingLeft: 14 }}>
        <strong style={{ color: t.text }}>핵심:</strong> 한인 전문직 1명(변호사·의사) = 일반 광고주 10명 가치
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 06 — GTM
───────────────────────────────────────────────────────────────── */
function SlideGTM({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const phases = [
    { n: "01", label: "Hyperlocal", time: "0–6개월", items: ["포트리 · 팰리세이즈파크 · 플러싱", "한인교회 · 한인회 파트너십", "무료 리스팅 → 유료 전환"], goal: "500 비즈니스 DB" },
    { n: "02", label: "Digital Growth", time: "6–18개월", items: ["한인 유튜버 파트너십", "SEO: 뉴저지 한인 병원 키워드 장악", "카카오채널 마케팅"], goal: "MAU 30,000", hi: true },
    { n: "03", label: "National Scale", time: "18개월+", items: ["LA · 시카고 · 달라스 확장", "한국 기업 미국 진출 채널", "Series A 준비"], goal: "MAU 200,000" },
  ];

  return (
    <SlideWrap dark={dark} alt>
      <SlideLabel n="05" label="Go-to-Market" dark={dark} />
      <SlideTitleBlock title={<>NY/NJ 장악 → 미국 전역</>} sub="단계별 지역 확장 전략" dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(8px,1.5vw,20px)" }}>
        {phases.map((p) => (
          <div key={p.n} style={{ background: t.bg, border: `1px solid ${p.hi ? t.accent : t.border}`, borderRadius: 8, padding: "clamp(16px,2.5vw,30px) clamp(14px,2vw,26px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "clamp(12px,1.5vw,20px)" }}>
              <div>
                <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.9vw,11px)", fontWeight: 800, letterSpacing: "0.18em", color: p.hi ? t.accent : t.sub }}>PHASE {p.n}</div>
                <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.95rem,1.6vw,1.25rem)", fontWeight: 800, color: p.hi ? t.accent : t.text, marginTop: 4 }}>{p.label}</div>
              </div>
              <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", color: t.sub, whiteSpace: "nowrap" as const, border: `1px solid ${t.border}`, borderRadius: 4, padding: "3px 8px" }}>{p.time}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 clamp(12px,2vw,20px)" }}>
              {p.items.map((item) => (
                <li key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" as const, fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1.1vw,0.88rem)", color: t.sub, padding: "5px 0" }}>
                  <span style={{ color: p.hi ? t.accent : t.sub, marginTop: 1 }}>›</span>{item}
                </li>
              ))}
            </ul>
            <div style={{ paddingTop: "clamp(10px,1.2vw,14px)", borderTop: `1px solid ${t.border}`, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", fontWeight: 800, letterSpacing: "0.1em", color: t.sub, textTransform: "uppercase" as const }}>목표</span>
              <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.8rem,1.2vw,0.95rem)", fontWeight: 800, color: p.hi ? t.accent : t.text }}>{p.goal}</span>
            </div>
          </div>
        ))}
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 07 — COMPETITIVE
───────────────────────────────────────────────────────────────── */
function SlideCompetitive({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const headers = ["모바일 앱", "영어 지원", "광고 타겟팅", "비즈니스 검증", "커뮤니티"];
  const rows = [
    { name: "소리 Sori", checks: [true, true, true, true, true], hi: true },
    { name: "Heykorean", checks: [false, false, false, false, true] },
    { name: "미씨USA", checks: [false, true, false, false, true] },
    { name: "Yelp", checks: [true, true, true, false, false] },
  ];
  const colStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1.5fr repeat(5,1fr)", gap: 8, alignItems: "center" };

  return (
    <SlideWrap dark={dark}>
      <SlideLabel n="06" label="Competitive Landscape" dark={dark} />
      <SlideTitleBlock title={<>커뮤니티와 디렉토리를 함께 푸는<br />유일한 플랫폼</>} dark={dark} />
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ ...colStyle, background: t.tableHead, padding: "clamp(10px,1.2vw,16px) clamp(14px,2vw,24px)" }}>
          <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", fontWeight: 800, color: t.sub, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>플랫폼</div>
          {headers.map((h) => (
            <div key={h} style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", fontWeight: 800, color: t.sub, letterSpacing: "0.08em", textTransform: "uppercase" as const, textAlign: "center" as const }}>{h}</div>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.name} style={{ ...colStyle, padding: "clamp(12px,1.8vw,20px) clamp(14px,2vw,24px)", borderTop: `1px solid ${t.border}`, background: row.hi ? t.highlight : "transparent" }}>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.82rem,1.2vw,0.95rem)", fontWeight: row.hi ? 800 : 400, color: row.hi ? t.accent : t.sub }}>{row.name}</div>
            {row.checks.map((c, j) => (
              <div key={j} style={{ textAlign: "center" as const, fontSize: "clamp(0.85rem,1.2vw,1.1rem)", color: c ? t.accent : t.border }}>{c ? "✓" : "✗"}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "clamp(12px,1.8vw,22px)", fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1vw,0.88rem)", color: t.sub, paddingLeft: 14, borderLeft: `3px solid ${t.border}` }}>
        <strong style={{ color: t.text }}>진짜 해자:</strong> 문화적 신뢰 × 네트워크 효과 × 한국어 + 영어 이중언어 UX
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 08 — TEAM
───────────────────────────────────────────────────────────────── */
function SlideTeam({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const team = [
    { role: "CEO & Co-founder", badge: "VC 심사역 출신", tags: ["VC 투자 경험", "Startup Exit", "한인 커뮤니티"], bio: "VC 심사역 출신. 스타트업 Exit 경험. 뉴욕/뉴저지 한인 커뮤니티 깊은 이해.", hi: true },
    { role: "CTO & Co-founder", badge: "엔지니어링 리드", tags: ["Full-Stack", "Mobile", "SaaS 아키텍처"], bio: "모바일 앱 + 웹 플랫폼 개발. SaaS 광고 시스템 설계 및 구현." },
    { role: "Head of Growth", badge: "채용 예정", tags: ["한인 커뮤니티", "영업", "마케팅"], bio: "NY/NJ 한인 비즈니스 네트워크 보유. 오프라인 영업 + 디지털 그로쓰 하이브리드.", hiring: true },
  ];

  return (
    <SlideWrap dark={dark} alt>
      <SlideLabel n="07" label="The Team" dark={dark} />
      <SlideTitleBlock title={<>이 시장에서 가장 적합한 사람들</>} dark={dark} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(8px,1.5vw,20px)" }}>
        {team.map((m) => (
          <div key={m.role} style={{ background: t.bg, border: `1px solid ${m.hi ? t.accent : t.border}`, borderRadius: 8, padding: "clamp(18px,2.5vw,32px) clamp(14px,2vw,26px)", opacity: m.hiring ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(12px,1.8vw,22px)" }}>
              <div style={{ width: "clamp(32px,3.5vw,44px)", height: "clamp(32px,3.5vw,44px)", borderRadius: "50%", background: m.hi ? t.highlight : t.bgAlt, border: `1px solid ${m.hi ? t.accent : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Pretendard, sans-serif", fontSize: "clamp(10px,1vw,14px)", fontWeight: 800, color: m.hi ? t.accent : t.sub }}>
                {m.hiring ? "+" : "★"}
              </div>
              <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", fontWeight: 700, padding: "4px 10px", borderRadius: 4, border: `1px solid ${t.border}`, color: m.hi ? t.accent : t.sub, background: m.hi ? t.highlight : t.chip }}>{m.badge}</span>
            </div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.88rem,1.4vw,1.1rem)", fontWeight: 800, color: t.text, marginBottom: 12, lineHeight: 1.3 }}>{m.role}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 14 }}>
              {m.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(8px,0.8vw,10px)", fontWeight: 600, padding: "3px 9px", borderRadius: 3, background: t.chip, color: t.sub, border: `1px solid ${t.border}`, letterSpacing: "0.04em" }}>{tag}</span>
              ))}
            </div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1.1vw,0.88rem)", color: t.sub, lineHeight: 1.7 }}>{m.bio}</div>
          </div>
        ))}
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SLIDE 09 — THE ASK
───────────────────────────────────────────────────────────────── */
function SlideAsk({ dark }: { dark: boolean }) {
  const t = tokens(dark);
  const uses = [
    { label: "엔지니어링", desc: "개발자 2명 채용\n모바일 앱 + 플랫폼" },
    { label: "세일즈", desc: "NY/NJ 영업 담당 1명\n오프라인 파트너십" },
    { label: "런웨이", desc: "18개월 운영\nSeries A 준비" },
  ];
  const milestones = [
    { month: "6개월", goal: "500 비즈니스 DB + 앱 출시", arr: "" },
    { month: "12개월", goal: "MAU 10,000", arr: "+ $150K ARR" },
    { month: "18개월", goal: "MAU 30,000", arr: "+ $450K ARR → Series A", hi: true },
  ];

  return (
    <SlideWrap dark={dark}>
      <SlideLabel n="08" label="The Ask" dark={dark} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: "clamp(16px,2.5vw,32px)", flexWrap: "wrap" as const }}>
        <h2 style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1.65rem,3.5vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: t.text, margin: 0 }}>Seed Round</h2>
        <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1.6rem,3.2vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: t.accent }}>$500K – $1M</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "clamp(12px,2vw,28px)" }}>
        <div>
          <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", fontWeight: 800, letterSpacing: "0.18em", color: t.sub, textTransform: "uppercase" as const, marginBottom: "clamp(10px,1.5vw,18px)" }}>사용 계획</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "clamp(8px,1.2vw,14px)" }}>
            {uses.map((u) => (
              <div key={u.label} style={{ border: `1px solid ${t.border}`, borderRadius: 6, padding: "clamp(12px,1.8vw,20px)", background: t.bgAlt }}>
                <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.82rem,1.2vw,0.95rem)", fontWeight: 800, color: t.text, marginBottom: 6 }}>{u.label}</div>
                <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.72rem,1vw,0.85rem)", color: t.sub, whiteSpace: "pre-line" as const, lineHeight: 1.7 }}>{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(9px,0.85vw,11px)", fontWeight: 800, letterSpacing: "0.18em", color: t.sub, textTransform: "uppercase" as const, marginBottom: "clamp(10px,1.5vw,18px)" }}>마일스톤</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "clamp(6px,1vw,10px)" }}>
            {milestones.map((m) => (
              <div key={m.month} style={{ display: "flex", alignItems: "center", padding: "clamp(12px,1.8vw,20px)", border: `1px solid ${m.hi ? t.accent : t.border}`, borderRadius: 6, background: m.hi ? t.highlight : t.bgAlt, gap: "clamp(12px,2vw,24px)" }}>
                <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.75rem,1.1vw,0.88rem)", fontWeight: 800, color: m.hi ? t.accent : t.sub, minWidth: "clamp(48px,6vw,72px)", flexShrink: 0 }}>{m.month}</span>
                <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.8rem,1.2vw,0.92rem)", color: t.text, fontWeight: m.hi ? 700 : 400 }}>{m.goal}</span>
                {m.arr && <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.72rem,1vw,0.85rem)", color: m.hi ? t.accent : t.sub, marginLeft: "auto", fontWeight: 700, whiteSpace: "nowrap" as const }}>{m.arr}</span>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "clamp(16px,2.5vw,32px)", paddingTop: "clamp(14px,2vw,22px)", borderTop: `1px solid ${t.border}`, textAlign: "right" as const }}>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(1.1rem,2vw,1.8rem)", fontWeight: 900, letterSpacing: "-0.03em", color: t.accent }}>소리 Sori</div>
            <div style={{ fontFamily: "Pretendard, sans-serif", fontSize: "clamp(0.7rem,0.9vw,0.82rem)", color: t.sub, marginTop: 4, letterSpacing: "0.06em" }}>oursori.com</div>
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PRESENTER
───────────────────────────────────────────────────────────────── */
export default function DeckClient({ markdown: _ }: { markdown: string }) {
  const [index, setIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>("light");
  const total = SLIDES.length;
  const isDark = theme === "dark";
  const t = tokens(isDark);

  useEffect(() => {
    const saved = window.localStorage.getItem("sori-deck-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("sori-deck-theme", theme);
  }, [theme]);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const slideComponents = [
    <SlideCover key="cover" dark={isDark} />,
    <SlideProblem key="problem" dark={isDark} />,
    <SlideMarket key="market" dark={isDark} />,
    <SlideSolution key="solution" dark={isDark} />,
    <SlideRevenue key="revenue" dark={isDark} />,
    <SlideGTM key="gtm" dark={isDark} />,
    <SlideCompetitive key="competitive" dark={isDark} />,
    <SlideTeam key="team" dark={isDark} />,
    <SlideAsk key="ask" dark={isDark} />,
  ];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: t.bg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      {/* ── TOP BAR ── */}
      <div style={{ height: 44, minHeight: 44, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(14px,2vw,28px)", background: t.bg, zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Pretendard, sans-serif", fontSize: 15, fontWeight: 900, color: t.accent, letterSpacing: "-0.02em" }}>소리</span>
          <span style={{ width: 1, height: 14, background: t.border }} />
          <span style={{ fontSize: 11, color: t.sub, fontWeight: 500, letterSpacing: "0.04em" }}>Investor Deck · 2025</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: t.sub, textDecoration: "none", border: `1px solid ${t.border}`, borderRadius: 4, padding: "4px 10px", background: t.chip }}>
            ← 홈
          </Link>
          <button onClick={() => setTheme(isDark ? "light" : "dark")} style={{ fontSize: 11, fontWeight: 600, color: t.sub, border: `1px solid ${t.border}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", background: t.chip }}>
            {isDark ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </div>

      {/* ── SLIDE AREA ── */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {slideComponents[index]}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ height: 44, minHeight: 44, borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, background: t.bg, flexShrink: 0, position: "relative" }}>
        <button onClick={prev} disabled={index === 0} style={{ width: 28, height: 28, border: `1px solid ${t.border}`, borderRadius: 4, background: "transparent", color: index === 0 ? t.border : t.text, cursor: index === 0 ? "default" : "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 3, background: i === index ? t.accent : t.border, border: "none", cursor: "pointer", transition: "width 0.2s ease, background 0.2s ease", padding: 0 }} />
          ))}
        </div>
        <button onClick={next} disabled={index === total - 1} style={{ width: 28, height: 28, border: `1px solid ${t.border}`, borderRadius: 4, background: "transparent", color: index === total - 1 ? t.border : t.text, cursor: index === total - 1 ? "default" : "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
        <span style={{ position: "absolute", right: "clamp(14px,2vw,28px)", fontSize: 11, color: t.sub, fontWeight: 600, letterSpacing: "0.06em" }}>{index + 1} / {total}</span>
      </div>
    </div>
  );
}
