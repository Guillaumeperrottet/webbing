"use client";

import { type PreviewScreen } from "@/components/project-preview";
import { type PortfolioDemoId } from "@/data/demo-stories";
import { OpenwindDemo } from "@/components/openwind-demo";
import { WispDemo } from "@/components/project-demos/wisp-demo";
import { PlannerDemo } from "@/components/project-demos/planner-demo";
import { AlphaDemo, PattusDemo } from "@/components/project-demos/hotel-demos";
import { CoachingDemo } from "@/components/project-demos/coaching-demo";
import { GraphomouvDemo } from "@/components/project-demos/graphomouv-demo";
import { DipiazaDemo } from "@/components/project-demos/dipiaza-demo";

export type { PortfolioDemoId } from "@/data/demo-stories";

export function PortfolioDemo({ id, screen, active }: { id: PortfolioDemoId; screen: PreviewScreen; active: boolean }) {
  switch (id) {
    case "openwind": return <OpenwindDemo screen={screen} active={active} />;
    case "wisp": return <WispDemo screen={screen} active={active} />;
    case "plannikeeper": return <PlannerDemo active={active} />;
    case "pattus-hotel": return <PattusDemo screen={screen} active={active} />;
    case "alpha-hotel": return <AlphaDemo screen={screen} active={active} />;
    case "coachingbymarie": return <CoachingDemo screen={screen} active={active} />;
    case "graphomouv": return <GraphomouvDemo screen={screen} active={active} />;
    case "dipiaza": return <DipiazaDemo screen={screen} active={active} />;
  }
}
