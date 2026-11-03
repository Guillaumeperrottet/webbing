import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { shareImageAlt } from "@/data/site-meta";

export const alt = shareImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#171313";
const muted = "#5e5653";
const paper = "#f4f1ef";
const rose = "#e11d48";
const folders = ["Selfcamp", "OpenWind", "Wisp", "PlanniKeeper", "Pattùs", "Alpha Hotel", "Coachingbymarie", "Graphomouv", "Dipiaza"];

async function asset(path: string, mime: string) {
  return `data:${mime};base64,${(await readFile(join(process.cwd(), "public", path))).toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [displayFont, bodyFont, logo, map, fiche] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/SF-Pro-Display-Bold.woff")),
    readFile(join(process.cwd(), "public/fonts/SF-Pro-Display-Medium.woff")),
    asset("webbing_informatique.png", "image/png"),
    asset("projects/selfcamp-map.jpg", "image/jpeg"),
    asset("projects/selfcamp-camping-du-lac.png", "image/png"),
  ]);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "white", color: ink, fontFamily: "SF Pro Display", fontWeight: 500 }}>
      <img src={logo} alt="" width={126} height={84} style={{ position: "absolute", left: 43, top: 28, objectFit: "contain" }} />
      <div style={{ position: "absolute", right: 48, top: 58, display: "flex", fontSize: 18, color: muted }}>Bulle · Fribourg</div>
      <div style={{ position: "absolute", left: 48, top: 173, display: "flex", flexDirection: "column", fontFamily: "SF Pro Display", fontWeight: 700, fontSize: 61, lineHeight: 1.03, letterSpacing: -2 }}>
        <span>Sites et</span><span>applications</span><span>sur mesure</span><span>à Bulle.</span>
      </div>
      <div style={{ position: "absolute", left: 49, top: 467, display: "flex", flexDirection: "column", fontSize: 22, lineHeight: 1.45, color: muted }}>
        <span>Un interlocuteur unique,</span><span>de l’idée à la mise en ligne.</span>
      </div>
      <div style={{ position: "absolute", left: 49, bottom: 36, display: "flex", fontSize: 18, borderBottom: `2px solid ${rose}`, paddingBottom: 5 }}>webbing.ch</div>
      <div style={{ position: "absolute", left: 568, top: 173, width: 585, height: 390, display: "flex" }}>
        <div style={{ position: "absolute", top: 0, left: 25, display: "flex", fontSize: 17 }}>Applications web</div>
        <div style={{ position: "absolute", top: 0, right: 35, display: "flex", fontSize: 17, color: rose }}>Sites web</div>
        <svg width="570" height="45" viewBox="0 0 570 45" fill="none" style={{ position: "absolute", left: 8, top: 24 }}>
          <path d="M8 35V12Q8 6 17 6H223Q232 6 232 12V18M4 30L8 36L12 30" stroke={ink} strokeWidth="1.5" />
          <path d="M250 18V12Q250 6 259 6H545Q554 6 554 12V27M550 22L554 28L558 22" stroke={rose} strokeWidth="1.5" />
        </svg>
        <div style={{ position: "absolute", top: 52, left: 0, width: 585, height: 336, display: "flex", border: "1px solid #b7b1ae", borderRadius: 15, background: paper }} />
        {Array.from({ length: 8 }, (_, index) => 8 - index).map((depth) => <div key={depth} style={{ position: "absolute", left: 8, top: 85 - depth * 3.5, width: 569, height: 290, display: "flex", border: `1px solid ${ink}`, borderRadius: 10, background: depth % 2 ? "#eeebe9" : "#e6e3e1" }} />)}
        {folders.slice(1).map((name, index) => <div key={name} style={{ position: "absolute", left: 8 + (index + 1) * 63, top: 52 - (index + 1) * 3.5, width: 64, height: 37, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${ink}`, borderBottom: "none", borderTopLeftRadius: 7, borderTopRightRadius: 7, background: "#eeebe9", fontSize: name.length > 12 ? 7 : name.length > 9 ? 8 : 9 }}>{name}</div>)}
        <div style={{ position: "absolute", left: 8, top: 85, width: 569, height: 290, display: "flex", border: `1.5px solid ${ink}`, borderBottom: `5px solid ${ink}`, borderRadius: 10, background: "white" }} />
        <div style={{ position: "absolute", left: 8, top: 52, width: 64, height: 35, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${ink}`, borderBottom: "none", borderTopLeftRadius: 7, borderTopRightRadius: 7, background: "white", fontSize: 9 }}>Selfcamp</div>
        <div style={{ position: "absolute", left: 26, top: 107, width: 533, height: 221, display: "flex", overflow: "hidden", border: "1px solid #e4deda", borderRadius: 6 }}>
          <img src={map} alt="" width={533} height={333} style={{ position: "absolute", top: -30, left: 0, objectFit: "cover" }} />
          <img src={fiche} alt="" width={132} height={167} style={{ position: "absolute", right: 12, top: 16, borderRadius: 4 }} />
        </div>
        <div style={{ position: "absolute", left: 28, top: 344, display: "flex", alignItems: "center", gap: 13, fontSize: 18 }}>
          <span style={{ color: "#3a4d2a", fontWeight: 700 }}>Selfcamp</span><span style={{ color: muted, fontSize: 14 }}>Carte, réservation et paiement.</span>
        </div>
      </div>
    </div>,
    { ...size, fonts: [
      { name: "SF Pro Display", data: displayFont, weight: 700, style: "normal" },
      { name: "SF Pro Display", data: bodyFont, weight: 500, style: "normal" },
    ] },
  );
}
