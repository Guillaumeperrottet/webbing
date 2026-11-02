"use client";

import { Cloud, FileImage, FileText, Link2 } from "lucide-react";
import { type PreviewScreen } from "@/components/project-preview";
import { type DemoSequence } from "@/components/use-demo-motion";
import { DemoFrame, DemoScreen, reveal, useProjectDemo } from "./demo-frame";

const sequence: DemoSequence = [
  ...[35, 27, 19].map((distance, index) => ({ selector: `.wisp-file--${index + 1}`, frames: [
    { opacity: 0, transform: "translateY(3cqw) rotate(-8deg)", offset: 0 },
    { opacity: 1, transform: `translateY(0) rotate(${index * 6 - 6}deg)`, offset: 0.08 + index * 0.035 },
    { opacity: 1, transform: `translateY(0) rotate(${index * 6 - 6}deg)`, offset: 0.17 + index * 0.09 },
    { opacity: 0, transform: `translate(${distance}cqw, -12cqw) scale(0.35) rotate(8deg)`, offset: 0.36 + index * 0.09 },
    { opacity: 0, transform: "translateY(3cqw) rotate(-8deg)", offset: 1 },
  ] })),
  { selector: ".wisp-cloud", frames: [
    { transform: "scale(1)", offset: 0 },
    { transform: "scale(1)", offset: 0.29 },
    { transform: "scale(1.07)", offset: 0.36, curve: "soft" },
    { transform: "scale(1)", offset: 0.42 },
    { transform: "scale(1.06)", offset: 0.5, curve: "soft" },
    { transform: "scale(1)", offset: 0.58 },
    { transform: "scale(1)", offset: 1 },
  ] },
  { selector: ".wisp-share-link", frames: reveal(0.56, "translateY(-2cqw) scale(0.7)", "rotate(-8deg)") },
];

export function WispDemo({ screen, active }: { screen: PreviewScreen; active: boolean }) {
  const motion = useProjectDemo("wisp", active, sequence);
  return <DemoFrame id="wisp" motion={motion}>
    <DemoScreen screen={screen} />
    <div className="wisp-cloud"><Cloud strokeWidth={1.2} /><span className="wisp-swiss-mark"><svg viewBox="0 0 24 24"><path d="M9 4H15V9H20V15H15V20H9V15H4V9H9Z" /></svg></span></div>
    <div className="wisp-file wisp-file--1"><FileImage /><span>JPG</span></div>
    <div className="wisp-file wisp-file--2"><FileText /><span>PDF</span></div>
    <div className="wisp-file wisp-file--3"><FileText /><span>DOC</span></div>
    <div className="wisp-share-link"><Link2 strokeWidth={1.5} /></div>
  </DemoFrame>;
}
