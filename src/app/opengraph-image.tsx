import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { shareImageAlt } from "@/data/site-meta";

export const alt = shareImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function asset(path: string) {
  return `data:image/png;base64,${(await readFile(join(process.cwd(), "public", path))).toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [displayFont, bodyFont, logo, preview] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/SF-Pro-Display-Medium.woff")),
    readFile(join(process.cwd(), "public/fonts/SF-Pro-Display-Regular.woff")),
    asset("webbing_informatique.png"),
    asset("selfcamp_accueil.png"),
  ]);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 48, background: "white", color: "#171313", fontFamily: "SF Pro Display", fontWeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src={logo} alt="" width={100} height={66} style={{ objectFit: "contain" }} />
        <span style={{ fontSize: 20, color: "#5e5653" }}>Studio web indépendant · Bulle, Suisse romande</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexGrow: 1, gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 490, fontWeight: 500, fontSize: 90, lineHeight: 0.99, letterSpacing: -5 }}>
          <span>Le web,</span><span>à votre</span><span style={{ display: "flex" }}>mesure<span style={{ color: "#bd2847" }}>.</span></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: 530, gap: 16 }}>
          <img src={preview} alt="Aperçu du site Selfcamp" width={530} height={340} style={{ objectFit: "cover", borderRadius: 8 }} />
          <span style={{ fontSize: 18, color: "#5e5653" }}>Selfcamp · Une réalisation Webbing</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #d9d5d3", paddingTop: 20, fontSize: 20 }}>
        <span>Sites et applications sur mesure.</span><span>webbing.ch</span>
      </div>
    </div>,
    { ...size, fonts: [
      { name: "SF Pro Display", data: displayFont, weight: 500, style: "normal" },
      { name: "SF Pro Display", data: bodyFont, weight: 400, style: "normal" },
    ] },
  );
}
