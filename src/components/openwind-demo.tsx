"use client";

import Image from "next/image";
import { useRef } from "react";
import { type PreviewScreen } from "@/components/project-preview";
import { type DemoSequence, type MotionFrame, useDemoMotion } from "@/components/use-demo-motion";

// A weather illustration over the supplied map, independent of its captured forecast values.
const gust = (start: number): MotionFrame[] => [
  { opacity: 0, transform: "translateX(-28cqw)", offset: 0 },
  { opacity: 0, transform: "translateX(-28cqw)", offset: start },
  { opacity: 0.9, transform: "translateX(-8cqw)", offset: start + 0.04 },
  { opacity: 0, transform: "translateX(74cqw)", offset: start + 0.19 },
  { opacity: 0, transform: "translateX(-28cqw)", offset: start + 0.195 },
  { opacity: 0, transform: "translateX(-28cqw)", offset: start + 0.23 },
  { opacity: 0.75, transform: "translateX(-8cqw)", offset: start + 0.27 },
  { opacity: 0, transform: "translateX(74cqw)", offset: start + 0.44 },
  { opacity: 0, transform: "translateX(74cqw)", offset: 1 },
];

const sequence: DemoSequence = [
  ...[0.03, 0.09, 0.15].map((start, index) => ({ selector: `.openwind-gust--${index + 1}`, frames: gust(start) })),
  { selector: ".openwind-cloud--near", frames: [
    { opacity: 0, transform: "translateX(-4cqw)", offset: 0 },
    { opacity: 1, transform: "translateX(0)", offset: 0.08 },
    { opacity: 1, transform: "translateX(5cqw)", offset: 0.22 },
    { opacity: 0, transform: "translateX(40cqw) rotate(5deg)", offset: 0.5 },
    { opacity: 0, transform: "translateX(40cqw) rotate(5deg)", offset: 1 },
  ] },
  { selector: ".openwind-cloud--far", frames: [
    { opacity: 0, transform: "translateX(-18cqw)", offset: 0 },
    { opacity: 0.9, transform: "translateX(0)", offset: 0.12 },
    { opacity: 0.9, transform: "translateX(15cqw)", offset: 0.3 },
    { opacity: 0, transform: "translateX(75cqw)", offset: 0.58 },
    { opacity: 0, transform: "translateX(75cqw)", offset: 1 },
  ] },
  { selector: ".openwind-sock-fabric", frames: [
    { transform: "rotate(24deg) scaleX(0.85)", offset: 0 },
    { transform: "rotate(-7deg) scaleX(1)", offset: 0.1 },
    { transform: "rotate(5deg) scaleX(0.96)", offset: 0.16 },
    { transform: "rotate(-9deg) scaleX(1.03)", offset: 0.22 },
    { transform: "rotate(4deg) scaleX(0.97)", offset: 0.28 },
    { transform: "rotate(-6deg) scaleX(1.02)", offset: 0.34 },
    { transform: "rotate(3deg) scaleX(0.98)", offset: 0.4 },
    { transform: "rotate(-3deg) scaleX(1)", offset: 0.46 },
    { transform: "rotate(12deg) scaleX(0.94)", offset: 0.58, curve: "soft" },
    { transform: "rotate(18deg) scaleX(0.91)", offset: 0.73, curve: "soft" },
    { transform: "rotate(14deg) scaleX(0.93)", offset: 0.85, curve: "soft" },
    { transform: "rotate(24deg) scaleX(0.85)", offset: 1 },
  ] },
  { selector: ".openwind-sun", frames: [
    { opacity: 0, transform: "translateY(3cqw) scale(0.8) rotate(-18deg)", offset: 0 },
    { opacity: 0, transform: "translateY(3cqw) scale(0.8) rotate(-18deg)", offset: 0.36 },
    { opacity: 1, transform: "translateY(0) scale(1) rotate(0deg)", offset: 0.56, curve: "soft" },
    { opacity: 1, transform: "translateY(-0.5cqw) scale(1) rotate(12deg)", offset: 0.86, curve: "soft" },
    { opacity: 0, transform: "translateY(0) scale(0.94) rotate(16deg)", offset: 0.99 },
    { opacity: 0, transform: "translateY(3cqw) scale(0.8) rotate(-18deg)", offset: 1 },
  ] },
];

function Cloud({ className }: { className: string }) {
  return <svg className={`openwind-cloud ${className}`} viewBox="0 0 180 96" fill="none">
    <path d="M39 78C21 78 10 67 10 53C10 40 20 29 34 28C38 13 50 6 64 6C82 6 95 17 99 33C104 30 110 29 115 29C129 29 140 38 143 50C160 49 171 58 171 69C171 81 160 88 147 88H42" />
  </svg>;
}

export function OpenwindDemo({ screen, active }: { screen: PreviewScreen; active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const { started, running } = useDemoMotion(root, active, sequence, 12000);

  return <div ref={root} className="portfolio-demo openwind-demo" data-demo="openwind" data-started={started} data-running={running}>
    <p className="visually-hidden">La véritable carte OpenWind, accompagnée d’une animation d’ambiance : des rafales poussent les nuages et font flotter une manche à air, puis le soleil apparaît. Cette illustration ne représente pas une évolution des prévisions affichées.</p>
    <div className="openwind-scene" aria-hidden="true">
      <div className="portfolio-screen-window">
        <Image src={screen.src} alt="" width={screen.width} height={screen.height} sizes="(max-width: 960px) 100vw, 800px" />
        <div className="openwind-weather">
          <svg className="openwind-sun" viewBox="0 0 120 120" fill="none">
            <circle className="openwind-sun-halo" cx="60" cy="60" r="57" />
            <circle cx="60" cy="60" r="25" />
            <path d="M60 12V22M60 98V108M12 60H22M98 60H108M26 26L33 33M87 87L94 94M26 94L33 87M87 33L94 26" />
          </svg>
          <Cloud className="openwind-cloud--far" />
          <Cloud className="openwind-cloud--near" />
          {[1, 2, 3].map((index) => <svg key={index} className={`openwind-gust openwind-gust--${index}`} viewBox="0 0 280 70" fill="none">
            <path d="M4 30H222C251 30 258 6 242 5C232 4 230 12 234 16M35 47H264M4 60H156C174 60 182 69 195 64" />
          </svg>)}
          <svg className="openwind-windsock" viewBox="0 0 180 150" fill="none">
            <path className="openwind-sock-pole" d="M24 140V20M12 140H38" />
            <g className="openwind-sock-fabric">
              <path className="openwind-sock-white" d="M26 17L161 35V51L26 67Z" />
              <path className="openwind-sock-blue" d="M26 17L54 21V64L26 67ZM82 25L109 28V57L82 60ZM136 32L161 35V51L136 54Z" />
              <path className="openwind-sock-outline" d="M26 17L161 35V51L26 67Z" />
              <ellipse className="openwind-sock-mouth" cx="26" cy="42" rx="7" ry="25" />
            </g>
          </svg>
        </div>
      </div>
    </div>
    <p className="portfolio-demo-caption">Balises et prévisions pour choisir son prochain spot.</p>
  </div>;
}
