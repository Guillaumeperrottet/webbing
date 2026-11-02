"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, LoaderCircle, MapPin } from "lucide-react";
import { track } from "@vercel/analytics";
import { SectionArrival } from "@/components/section-arrival";

const emptyForm = { name: "", email: "", company: "", message: "" };

export function ContactSection() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isSubmitted) successHeading.current?.focus();
  }, [isSubmitted]);
  const [formData, setFormData] = useState(emptyForm);

  const handleInputChange = (field: keyof typeof emptyForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData(emptyForm);
        try {
          track("Contact Form Submit", {
            service: "not_specified",
            hasCompany: !!formData.company,
          });
        } catch {
          console.warn("Le suivi du formulaire n’a pas pu être enregistré.");
        }
      } else {
        setSubmitError(
          "Le message n'a pas pu être envoyé. Vous pouvez aussi nous écrire à gp@webbing.ch.",
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitError(
        "Le message n'a pas pu être envoyé. Vous pouvez aussi nous écrire à gp@webbing.ch.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="site-section contact-section">
        <div className="site-container">
          <div className="contact-success" role="status" aria-live="polite">
            <CheckCircle className="mb-6 h-10 w-10 text-primary" aria-hidden="true" />
            <h2 ref={successHeading} tabIndex={-1} className="section-heading">
              Message envoyé !
            </h2>
            <p className="page-lead mt-6">
              Merci pour votre message. Nous vous recontacterons pour échanger
              sur votre projet.
            </p>
            <Button
              type="button"
              size="lg"
              className="mt-8"
              onClick={() => {
                setIsSubmitted(false);
                requestAnimationFrame(() => {
                  document.getElementById("name")?.focus();
                });
              }}
            >
              Envoyer un autre message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="site-section contact-section" aria-labelledby="contact-title">
      <div className="site-container">
       <SectionArrival className="contact-grid">
        <div className="contact-copy">
          <h2 id="contact-title" className="section-heading">Parlons de votre projet.</h2>
          <p>Un site pour présenter votre activité, une application pour simplifier votre travail : commençons par votre besoin.</p>
          <a className="contact-email" href="mailto:gp@webbing.ch">gp@webbing.ch</a>
          <a className="contact-phone" href="tel:+41793414074">+41 79 341 40 74</a>
          <p className="contact-address"><MapPin size={18} aria-hidden="true" />Rue de Battentin 1, 1630 Bulle</p>
          <noscript><p>Pour envoyer votre message sans JavaScript, contactez-nous par email ou téléphone.</p></noscript>
        </div>
          <form
            action="/api/contact"
            method="post"
            onSubmit={handleSubmit}
            aria-labelledby="contact-title"
            aria-describedby={submitError ? "form-intro contact-next-steps contact-error" : "form-intro contact-next-steps"}
            aria-busy={isSubmitting}
            className="contact-form min-w-0 space-y-6"
          >
            <p id="form-intro" className="text-base leading-relaxed text-muted-foreground">
              Décrivez votre activité et ce que vous aimeriez améliorer. Une première idée suffit.
            </p>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base leading-normal">Nom (obligatoire)</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 border-muted-foreground text-base md:text-base motion-reduce:transition-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base leading-normal">Email (obligatoire)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 border-muted-foreground text-base md:text-base motion-reduce:transition-none"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="company" className="text-base leading-normal">Entreprise (facultatif)</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="h-12 border-muted-foreground text-base md:text-base motion-reduce:transition-none"
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-base leading-normal">Votre projet (obligatoire)</Label>
              <Textarea
                id="message"
                name="message"
                autoComplete="off"
                required
                aria-required="true"
                placeholder="Votre activité, le besoin à résoudre, votre site actuel si vous en avez un…"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="min-h-40 resize-y border-muted-foreground text-base md:text-base motion-reduce:transition-none"
              />
            </div>

            <div className="space-y-3">
             <Button
              type="submit"
              size="lg"
              disabled={!ready || isSubmitting}
              aria-busy={isSubmitting}
              className="w-full sm:w-auto sm:min-w-56"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer le message
                  <Send aria-hidden="true" />
                </>
              )}
             </Button>
             <p id="contact-next-steps" className="max-w-prose text-base leading-relaxed text-muted-foreground">
               Après votre message, nous vous recontactons pour préciser vos objectifs et le périmètre du projet, puis définir ensemble les prochaines étapes.
             </p>
            </div>
            {submitError && (
              <p id="contact-error" className="text-base text-destructive" role="alert">
                {submitError}
              </p>
            )}
          </form>

       </SectionArrival>
      </div>
    </section>
  );
}
