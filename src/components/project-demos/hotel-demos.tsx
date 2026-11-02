"use client";

import Image from "next/image";
import { UserRound, UsersRound } from "lucide-react";
import { type PreviewScreen } from "@/components/project-preview";
import { type DemoSequence } from "@/components/use-demo-motion";
import { DemoFrame, DemoScreen, useProjectDemo } from "./demo-frame";

const pattusSequence: DemoSequence = [
  { selector: ".pattus-lake-view", frames: [
    { opacity: 0, transform: "translateY(0.8cqw)", offset: 0 },
    { opacity: 0, transform: "translateY(0.8cqw)", offset: 0.19 },
    { opacity: 1, transform: "translateY(0)", offset: 0.34, curve: "soft" },
    { opacity: 1, transform: "translateY(0)", offset: 0.89, curve: "soft" },
    { opacity: 0, transform: "translateY(0)", offset: 0.99 },
    { opacity: 0, transform: "translateY(0.8cqw)", offset: 1 },
  ] },
  { selector: ".pattus-lake-photo", frames: [
    { transform: "scale(1.035)", offset: 0 },
    { transform: "scale(1.035)", offset: 0.2, curve: "soft" },
    { transform: "scale(1)", offset: 0.86, curve: "soft" },
    { transform: "scale(1.035)", offset: 1 },
  ] },
  ...[0.03, 0.1, 0.17].map((start, index) => ({ selector: `.pattus-ripple--${index + 1}`, frames: [
    { opacity: 0, transform: "translateX(-1cqw) scaleX(0.8)", offset: 0 },
    { opacity: 0, transform: "translateX(-1cqw) scaleX(0.8)", offset: start },
    { opacity: 0.55, transform: "translateX(0) scaleX(1)", offset: start + 0.12 },
    { opacity: 0, transform: "translateX(2cqw) scaleX(1.1)", offset: start + 0.32 },
    { opacity: 0, transform: "translateX(-1cqw) scaleX(0.8)", offset: start + 0.4 },
    { opacity: 0.4, transform: "translateX(0) scaleX(1)", offset: start + 0.52 },
    { opacity: 0, transform: "translateX(2cqw) scaleX(1.1)", offset: start + 0.73 },
    { opacity: 0, offset: 1 },
  ] })),
];

export function PattusDemo({ screen, active }: { screen: PreviewScreen; active: boolean }) {
  const motion = useProjectDemo("pattus-hotel", active, pattusSequence);
  return <DemoFrame id="pattus-hotel" motion={motion}>
    <DemoScreen screen={screen} />
    <svg className="pattus-lake-ripples" viewBox="0 0 400 150" fill="none">
      <path className="pattus-ripple--1" d="M12 35C54 27 76 44 121 35S191 27 230 35" />
      <path className="pattus-ripple--2" d="M60 70C100 62 126 79 168 70S238 62 279 70" />
      <path className="pattus-ripple--3" d="M20 106C55 99 86 113 124 106S188 99 222 106" />
    </svg>
    <figure className="pattus-lake-view">
      <div className="pattus-lake-photo-window"><Image className="pattus-lake-photo" src="/projects/usage/pattus-suite-lake-original.jpg" alt="" width={1080} height={608} sizes="(max-width: 960px) 75vw, 600px" /></div>
      <figcaption><span>Pattùs</span><span>Suite vue lac<small>Lac de Neuchâtel</small></span></figcaption>
    </figure>
  </DemoFrame>;
}

// Compare two published room types rather than running an interchangeable photo carousel.
const alphaSequence: DemoSequence = [
  { selector: ".alpha-compare-room--simple", frames: [
    { transform: "translateY(0)", offset: 0 },
    { transform: "translateY(-1.6cqw)", offset: 0.12 },
    { transform: "translateY(-1.6cqw)", offset: 0.38, curve: "soft" },
    { transform: "translateY(0)", offset: 0.5 }, { transform: "translateY(0)", offset: 1 },
  ] },
  { selector: ".alpha-compare-room--double", frames: [
    { transform: "translateY(0)", offset: 0 }, { transform: "translateY(0)", offset: 0.42 },
    { transform: "translateY(-1.6cqw)", offset: 0.56 },
    { transform: "translateY(-1.6cqw)", offset: 0.86, curve: "soft" },
    { transform: "translateY(0)", offset: 1 },
  ] },
  { selector: ".alpha-compare-room--simple .alpha-room-focus", frames: [
    { opacity: 0, transform: "scaleX(0.2)", offset: 0 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.12 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.38 },
    { opacity: 0, transform: "scaleX(1)", offset: 0.5 }, { opacity: 0, offset: 1 },
  ] },
  { selector: ".alpha-compare-room--double .alpha-room-focus", frames: [
    { opacity: 0, transform: "scaleX(0.2)", offset: 0 },
    { opacity: 0, transform: "scaleX(0.2)", offset: 0.43 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.56 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.86 },
    { opacity: 0, transform: "scaleX(1)", offset: 1 },
  ] },
];

const alphaRooms = [
  { id: "simple", src: "/projects/usage/alpha-simple-original.jpg", title: "Chambre simple", height: 733, people: "1 personne", area: "16 m²", Icon: UserRound },
  { id: "double", src: "/projects/usage/alpha-double-original.jpg", title: "Chambre double", height: 853, people: "1–2 personnes", area: "22 m²", Icon: UsersRound },
];

export function AlphaDemo({ screen, active }: { screen: PreviewScreen; active: boolean }) {
  const motion = useProjectDemo("alpha-hotel", active, alphaSequence);
  return <DemoFrame id="alpha-hotel" motion={motion}>
    <DemoScreen screen={screen} />
    <div className="alpha-room-comparison">{alphaRooms.map(({ Icon, ...room }) => <figure className={`alpha-compare-room alpha-compare-room--${room.id}`} key={room.id}>
      <Image src={room.src} alt="" width={1200} height={room.height} sizes="(max-width: 960px) 45vw, 360px" />
      <figcaption><p>{room.title}</p><div><span><Icon />{room.people}</span><span>{room.area}</span></div><span className="alpha-room-focus" /></figcaption>
    </figure>)}</div>
  </DemoFrame>;
}
