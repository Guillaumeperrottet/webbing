"use client";

import { track } from "@vercel/analytics";
import { ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithRef, ReactNode } from "react";

type ContactLinkProps = ComponentPropsWithRef<"a"> & {
  section: string;
  project?: string;
};

export function ContactLink({ section, project, href = "#contact", onClick, ...props }: ContactLinkProps) {
  return <a {...props} href={href} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    try {
      track("CTA Click", { section, action: "contact_button", ...(project ? { project } : {}) });
    } catch {
      // The contact link remains usable when analytics is unavailable.
    }
  }} />;
}

export function ProjectLink({ href, name, category, application = false, children, className = "project-link" }: { href: string; name: string; category: string; application?: boolean; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${typeof children === "string" ? children : name} (nouvel onglet)`} onClick={() => track(application ? "Application Click" : "Project Click", application ? { app: name, category } : { project: name, category })}>{children}<ArrowUpRight aria-hidden="true" size={18} /></a>;
}

export function ProjectContactLink({ section = "projets", project, children = "Échangeons sur votre projet" }: { section?: string; project?: string; children?: ReactNode }) {
  return <ContactLink section={section} project={project} className="text-link">{children}</ContactLink>;
}
