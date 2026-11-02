import { ChevronDown } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { ContactLink, ProjectLink } from "@/components/project-link";

export function ProjectCaseStudy({ projectId, projectName, application }: { projectId: string; projectName: string; application: boolean }) {
  const study = caseStudies.find((entry) => entry.projectId === projectId);
  if (!study) return null;

  return (
    <details id={study.id} className="project-case-study">
      <summary aria-label={`Étude de cas de ${projectName}`}>
        <span>{study.summary}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="project-case-study-content">
        <h4>{study.title}</h4>
        <dl className="project-case-study-facts">
          {study.facts.map(({ label, text }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        {study.note && <p className="project-case-study-credits">{study.note}</p>}
        {study.credits && <p className="project-case-study-credits">{study.credits}</p>}
        <div className="project-case-study-actions">
          <ProjectLink href={study.proof.href} name={projectName} category="Étude de cas" application={application}>
            {study.proof.label}
          </ProjectLink>
          <ContactLink section="etude-de-cas" project={projectName} className="text-link">Parlons de votre projet</ContactLink>
        </div>
      </div>
    </details>
  );
}
