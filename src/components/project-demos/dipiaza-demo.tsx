"use client";

import Image from "next/image";
import { type PreviewScreen } from "@/components/project-preview";
import { type DemoSequence } from "@/components/use-demo-motion";
import { DemoFrame, DemoScreen, reveal, useProjectDemo } from "./demo-frame";

const sequence: DemoSequence = [
  { selector: ".dipiaza-cup", frames: [
    { transform: "translateY(2cqw) rotate(-6deg)", opacity: 0, offset: 0 },
    { transform: "translateY(0) rotate(0deg)", opacity: 1, offset: 0.1 },
    { transform: "translateY(0) rotate(0deg)", opacity: 1, offset: 0.9 },
    { transform: "translateY(2cqw) rotate(-6deg)", opacity: 0, offset: 1 },
  ] },
  { selector: ".dipiaza-coffee", frames: [
    { transform: "scaleY(0.08)", offset: 0 },
    { transform: "scaleY(0.08)", offset: 0.16 },
    { transform: "scaleY(1)", offset: 0.38, curve: "soft" },
    { transform: "scaleY(1)", offset: 0.94 }, { transform: "scaleY(0.08)", offset: 1 },
  ] },
  ...[0.3, 0.37, 0.44].map((start, index) => ({ selector: `.dipiaza-steam--${index + 1}`, frames: [
    { opacity: 0, transform: "translateY(1cqw) scaleY(0.7)", offset: 0 },
    { opacity: 0, transform: "translateY(1cqw) scaleY(0.7)", offset: start },
    { opacity: 0.75, transform: "translateY(0) scaleY(1)", offset: start + 0.08 },
    { opacity: 0, transform: "translateY(-4cqw) scaleY(1.2)", offset: start + 0.28 },
    { opacity: 0, transform: "translateY(1cqw) scaleY(0.7)", offset: start + 0.29 },
    { opacity: 0.6, transform: "translateY(0) scaleY(1)", offset: start + 0.37 },
    { opacity: 0, transform: "translateY(-3cqw) scaleY(1.2)", offset: Math.min(0.97, start + 0.53) },
    { opacity: 0, offset: 1 },
  ] })),
  { selector: ".dipiaza-address", frames: reveal(0.47, "translateX(3cqw) rotate(3deg)") },
];

export function DipiazaDemo({ screen, active }: { screen: PreviewScreen; active: boolean }) {
  const motion = useProjectDemo("dipiaza", active, sequence);
  return <DemoFrame id="dipiaza" motion={motion}>
    <DemoScreen screen={screen} />
    <svg className="dipiaza-cup" viewBox="0 0 240 240" fill="none">
      <path className="dipiaza-steam dipiaza-steam--1" d="M82 80C57 62 103 52 82 30" />
      <path className="dipiaza-steam dipiaza-steam--2" d="M114 77C91 57 137 46 114 18" />
      <path className="dipiaza-steam dipiaza-steam--3" d="M147 80C125 62 169 52 147 30" />
      <path className="dipiaza-saucer" d="M35 188H197C191 203 163 210 116 210C69 210 42 203 35 188Z" />
      <path className="dipiaza-cup-body" d="M53 104H179L170 151C167 176 146 189 116 189C86 189 65 176 62 151ZM178 115H193C216 115 216 151 187 155H172" />
      <g className="dipiaza-coffee"><path d="M61 119H171L165 149C162 170 143 181 116 181C89 181 70 170 67 149Z" /><ellipse cx="116" cy="119" rx="55" ry="8" /></g>
      <path className="dipiaza-cup-rim" d="M53 104C53 111 82 117 116 117C150 117 179 111 179 104" />
    </svg>
    <div className="dipiaza-address"><Image src="/projects/usage/dipiaza-bulle.jpg" alt="" width={368} height={440} sizes="(max-width: 960px) 34vw, 280px" /></div>
  </DemoFrame>;
}
