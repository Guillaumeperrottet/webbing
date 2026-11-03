"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useRef } from "react";
import { type MotionFrame, useDemoMotion } from "@/components/use-demo-motion";


// Brief arrivals alternate with still reading beats; each movement slows into its resting pose.
const sequence: { selector: string; frames: MotionFrame[] }[] = [
  { selector: ".selfcamp-map-motion", frames: [
    { transform: "scale(1)", offset: 0 },
    { transform: "scale(1)", offset: 0.025 },
    { transform: "scale(1.09)", offset: 0.13 },
    { transform: "scale(1.09)", offset: 0.9, curve: "soft" },
    { transform: "scale(1)", offset: 1 },
  ] },
  { selector: ".selfcamp-map-ring", frames: [
    { opacity: 0, transform: "scale(0.45)", offset: 0 },
    { opacity: 0, transform: "scale(0.45)", offset: 0.075 },
    { opacity: 0.8, transform: "scale(0.55)", offset: 0.095, curve: "soft" },
    { opacity: 0, transform: "scale(1.7)", offset: 0.19 },
    { opacity: 0, transform: "scale(1.7)", offset: 1 },
  ] },
  { selector: ".selfcamp-area-sheet", frames: [
    { opacity: 0, transform: "translateY(2.73cqw) rotate(4deg)", offset: 0 },
    { opacity: 0, transform: "translateY(2.73cqw) rotate(4deg)", offset: 0.19 },
    { opacity: 1, transform: "translateY(0) rotate(2deg)", offset: 0.25 },
    { opacity: 1, transform: "translateY(0) rotate(2deg)", offset: 0.88, curve: "soft" },
    { opacity: 0, transform: "translateY(-0.82cqw) rotate(2deg)", offset: 0.96 },
    { opacity: 0, transform: "translateY(-0.82cqw) rotate(2deg)", offset: 1 },
  ] },
  { selector: ".selfcamp-ticket", frames: [
    { opacity: 0, transform: "translateY(4.37cqw) rotate(-8deg)", offset: 0 },
    { opacity: 0, transform: "translateY(4.37cqw) rotate(-8deg)", offset: 0.3 },
    { opacity: 1, transform: "translateY(0) rotate(-4.5deg)", offset: 0.355, curve: "soft" },
    { opacity: 1, transform: "translateY(0) rotate(-5deg)", offset: 0.38 },
    { opacity: 1, transform: "translateY(0) rotate(-5deg)", offset: 0.9, curve: "soft" },
    { opacity: 0, transform: "translateY(1.09cqw) rotate(-5deg)", offset: 0.97 },
    { opacity: 0, transform: "translateY(1.09cqw) rotate(-5deg)", offset: 1 },
  ] },
  { selector: ".selfcamp-ticket-stamp", frames: [
    { opacity: 0, transform: "scale(1.15) rotate(-7deg)", offset: 0 },
    { opacity: 0, transform: "scale(1.15) rotate(-7deg)", offset: 0.41 },
    { opacity: 1, transform: "scale(0.985) rotate(-7deg)", offset: 0.44, curve: "soft" },
    { opacity: 1, transform: "scale(1) rotate(-7deg)", offset: 0.46 },
    { opacity: 1, transform: "scale(1) rotate(-7deg)", offset: 0.9, curve: "soft" },
    { opacity: 0, transform: "scale(1) rotate(-7deg)", offset: 0.96 },
    { opacity: 0, transform: "scale(1) rotate(-7deg)", offset: 1 },
  ] },
  { selector: ".selfcamp-ticket-note", frames: [
    { opacity: 0, transform: "translateY(0.68cqw) rotate(-3deg)", offset: 0 },
    { opacity: 0, transform: "translateY(0.68cqw) rotate(-3deg)", offset: 0.47, curve: "soft" },
    { opacity: 1, transform: "translateY(0) rotate(-3deg)", offset: 0.54 },
    { opacity: 1, transform: "translateY(0) rotate(-3deg)", offset: 0.9, curve: "soft" },
    { opacity: 0, transform: "translateY(0) rotate(-3deg)", offset: 0.96 },
    { opacity: 0, transform: "translateY(0) rotate(-3deg)", offset: 1 },
  ] },
];

export function SelfcampDemo({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const { started, running } = useDemoMotion(root, active, sequence);

  return (
    <div ref={root} className="selfcamp-demo" data-demo="selfcamp" data-js="true" data-started={started} data-running={running}>
      <p className="visually-hidden">Démonstration Selfcamp : repérer une aire sur la carte, consulter la fiche du Camping du Lac à Gumefens, puis réserver en ligne. Le ticket illustre la confirmation d’une réservation.</p>
      <div className="selfcamp-scene" aria-hidden="true">
        <div className="selfcamp-map-window">
          <div className="selfcamp-map-motion">
            <Image src="/projects/selfcamp-map.jpg" alt="" width={1440} height={900} priority sizes="(max-width: 960px) 100vw, 800px" />
            <span className="selfcamp-map-ring" />
          </div>
        </div>
        <div className="selfcamp-area-sheet">
          <Image src="/projects/selfcamp-camping-du-lac.png" alt="" width={258} height={327} priority sizes="260px" />
        </div>
        <div className="selfcamp-ticket">
          <p className="selfcamp-ticket-brand">Selfcamp</p>
          <p className="selfcamp-ticket-title">Votre prochaine escale.</p>
          <dl>
            <div><dt>Aire</dt><dd>Camping du Lac</dd></div>
            <div><dt>Lieu</dt><dd>Gumefens</dd></div>
            <div><dt>Réservation</dt><dd>En ligne</dd></div>
          </dl>
          <p className="selfcamp-ticket-stamp"><Check size={18} strokeWidth={2.5} />Réservé</p>
          <span className="selfcamp-ticket-note">Bon séjour !</span>
        </div>
      </div>
    </div>
  );
}
