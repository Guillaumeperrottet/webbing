"use client";

import Image from "next/image";
import { type PreviewScreen } from "@/components/project-preview";
import { type DemoSequence } from "@/components/use-demo-motion";
import { DemoFrame, DemoScreen, reveal, useProjectDemo } from "./demo-frame";

const sequence: DemoSequence = [
  ...[0, 1].map((index) => ({ selector: `.coaching-shoe--${index + 1}`, frames: [
    { opacity: 0, transform: "translate(0, 0) rotate(-5deg)", offset: 0 },
    { opacity: 1, transform: "translate(0, 0) rotate(-5deg)", offset: 0.06 + index * 0.05 },
    { opacity: 1, transform: "translate(1.5cqw, -3cqw) rotate(-15deg)", offset: 0.14 + index * 0.09 },
    { opacity: 1, transform: "translate(4cqw, 0) rotate(0deg)", offset: 0.22 + index * 0.09 },
    { opacity: 1, transform: "translate(5.5cqw, -3cqw) rotate(-15deg)", offset: 0.31 + index * 0.09 },
    { opacity: 1, transform: "translate(8cqw, 0) rotate(0deg)", offset: 0.39 + index * 0.09 },
    { opacity: 0, transform: "translate(8cqw, 0) rotate(0deg)", offset: 0.58 },
    { opacity: 0, transform: "translate(0, 0) rotate(-5deg)", offset: 1 },
  ] })),
  { selector: ".coaching-calendar", frames: reveal(0.33, "translateY(1.5cqw) rotate(2deg)", "rotate(2deg)") },
  { selector: ".coaching-course-focus--run", frames: [
    { opacity: 0, transform: "scaleY(0.2)", offset: 0 },
    { opacity: 0, transform: "scaleY(0.2)", offset: 0.44 },
    { opacity: 1, transform: "scaleY(1)", offset: 0.49 },
    { opacity: 1, offset: 0.62 }, { opacity: 0, offset: 0.69 }, { opacity: 0, offset: 1 },
  ] },
  { selector: ".coaching-course-focus--outdoor", frames: [
    { opacity: 0, transform: "scaleY(0.2)", offset: 0 },
    { opacity: 0, transform: "scaleY(0.2)", offset: 0.64 },
    { opacity: 1, transform: "scaleY(1)", offset: 0.7 },
    { opacity: 1, offset: 0.87 }, { opacity: 0, offset: 0.97 }, { opacity: 0, offset: 1 },
  ] },
];

function RunningShoe({ className }: { className: string }) {
  return <svg className={`coaching-shoe ${className}`} viewBox="0 0 180 90" fill="none">
    <path className="coaching-shoe-upper" d="M15 57L27 23C29 16 37 15 42 21L57 37L77 40L91 30C95 27 99 30 99 35V44L143 57C156 61 166 66 166 75H17C8 75 7 63 15 57Z" />
    <path className="coaching-shoe-sole" d="M12 70H166V80H17C10 80 8 76 12 70Z" />
    <path d="M56 39L53 49M68 42L65 52M80 44L77 54M92 46L89 56M25 36L41 46L37 61" />
  </svg>;
}

export function CoachingDemo({ screen, active }: { screen: PreviewScreen; active: boolean }) {
  const motion = useProjectDemo("coachingbymarie", active, sequence);
  return <DemoFrame id="coachingbymarie" motion={motion}>
    <DemoScreen screen={screen} />
    <div className="coaching-running"><RunningShoe className="coaching-shoe--1" /><RunningShoe className="coaching-shoe--2" /></div>
    <div className="coaching-calendar">
      <span className="coaching-calendar-rings" />
      <div className="coaching-calendar-viewport">
        <div className="coaching-calendar-content">
          <Image src="/projects/usage/coaching-tuesday.png" alt="" width={462} height={802} sizes="(max-width: 640px) 72vw, (max-width: 960px) 36vw, 280px" quality={90} />
          <span className="coaching-course-focus coaching-course-focus--run" /><span className="coaching-course-focus coaching-course-focus--outdoor" />
        </div>
      </div>
    </div>
  </DemoFrame>;
}
