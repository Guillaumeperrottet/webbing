"use client";

import Image from "next/image";
import { MousePointer2 } from "lucide-react";
import { type DemoSequence } from "@/components/use-demo-motion";
import { DemoFrame, useProjectDemo } from "./demo-frame";

const sequence: DemoSequence = [
  { selector: ".planner-team-view", frames: [
    { opacity: 0, offset: 0 }, { opacity: 0, offset: 0.25 }, { opacity: 1, offset: 0.3 },
    { opacity: 1, offset: 0.89, curve: "soft" }, { opacity: 0, offset: 0.98 }, { opacity: 0, offset: 1 },
  ] },
  { selector: ".planner-demo-pointer", frames: [
    { opacity: 0, transform: "translate(9cqw, 5cqw)", offset: 0 },
    { opacity: 0, transform: "translate(9cqw, 5cqw)", offset: 0.08 },
    { opacity: 1, transform: "translate(0, 0)", offset: 0.2 },
    { opacity: 1, transform: "scale(0.85)", offset: 0.25 },
    { opacity: 1, transform: "scale(1)", offset: 0.28 },
    { opacity: 0, transform: "translate(3cqw, 2cqw)", offset: 0.36 },
    { opacity: 0, offset: 1 },
  ] },
  { selector: ".planner-team-ring", frames: [
    { opacity: 0, transform: "scale(0.8)", offset: 0 },
    { opacity: 0, transform: "scale(0.8)", offset: 0.22 },
    { opacity: 0.7, transform: "scale(1)", offset: 0.25 },
    { opacity: 0, transform: "scale(1.5)", offset: 0.34 },
    { opacity: 0, offset: 1 },
  ] },
  { selector: ".planner-context-focus", frames: [
    { opacity: 0, transform: "scaleX(0.8)", offset: 0 },
    { opacity: 0, transform: "scaleX(0.8)", offset: 0.39 },
    { opacity: 1, transform: "scaleX(1)", offset: 0.46 },
    { opacity: 1, offset: 0.78 }, { opacity: 0, offset: 0.9 }, { opacity: 0, offset: 1 },
  ] },
];

export function PlannerDemo({ active }: { active: boolean }) {
  const motion = useProjectDemo("plannikeeper", active, sequence);
  return <DemoFrame id="plannikeeper" motion={motion}>
    <div className="planner-demo-window">
      <div className="planner-demo-camera">
        <Image src="/projects/usage/planni-personal.jpg" alt="" width={1120} height={580} sizes="(max-width: 640px) 330vw, (max-width: 960px) 100vw, 800px" quality={90} />
        <Image className="planner-team-view" src="/projects/usage/planni-team.jpg" alt="" width={1120} height={672} sizes="(max-width: 640px) 330vw, (max-width: 960px) 100vw, 800px" quality={90} />
        <span className="planner-team-ring" /><MousePointer2 className="planner-demo-pointer" />
        <span className="planner-context-focus" />
      </div>
    </div>
  </DemoFrame>;
}
