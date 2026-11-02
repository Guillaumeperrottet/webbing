import { type DemoSequence } from "@/components/use-demo-motion";

export type DemoBeats = readonly [number, number, number];

export function demoStepSequence(beats: DemoBeats): DemoSequence {
  return beats.map((start, index) => {
    const end = beats[index + 1] ?? 0.94;
    return {
      selector: `.demo-step-${index} .demo-step-line`,
      frames: [
        { opacity: 0, transform: "scaleX(0.4)", offset: 0 },
        { opacity: 0, transform: "scaleX(0.4)", offset: start },
        { opacity: 1, transform: "scaleX(1)", offset: start + 0.025 },
        { opacity: 1, transform: "scaleX(1)", offset: end - 0.025 },
        { opacity: 0, transform: "scaleX(1)", offset: end },
        { opacity: 0, transform: "scaleX(0.4)", offset: 1 },
      ],
    };
  });
}

export function DemoSteps({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="demo-steps" aria-label="Le parcours illustré">
      {steps.map((step, index) => (
        <li key={step} className={`demo-step-${index}`}>
          <span className="demo-step-number" aria-hidden="true">{index + 1}</span>
          <span>{step}</span>
          <span className="demo-step-line" aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}
