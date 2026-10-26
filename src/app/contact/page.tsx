"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, LoaderCircle, Mail, Phone, MapPin } from "lucide-react";
import { track } from "@vercel/analytics";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isSubmitted) successHeading.current?.focus();
  }, [isSubmitted]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    service: "",
  });

  const handleInputChange = (field: string, value: string) => {
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
        // Track successful form submission
        track("Contact Form Submit", {
          service: formData.service || "not_specified",
          hasCompany: !!formData.company,
        });

        setIsSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          service: "",
        });
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
      <section className="page-intro min-h-svh bg-background">
        <div className="site-container">
          <div className="max-w-2xl" role="status" aria-live="polite">
            <CheckCircle className="mb-6 h-10 w-10 text-primary" aria-hidden="true" />
            <h1 ref={successHeading} tabIndex={-1} className="page-title">
              Message envoyé !
            </h1>
            <p className="page-lead mt-6">
              Merci pour votre message. Nous vous répondrons dans les plus brefs
              délais.
            </p>
            <Button
              size="lg"
              className="mt-8"
              onClick={() => {
                setIsSubmitted(false);
                requestAnimationFrame(() => {
                  document.getElementById("firstName")?.focus();
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
    <>
      <section className="page-intro">
        <div className="site-container">
          <h1 id="contact-title" className="page-title">Contactez-nous</h1>
          <p className="page-lead mt-6">
            Une question ? Besoin d&apos;informations ? Nous sommes à votre écoute
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 lg:hidden" aria-label="Contact direct">
            <a href="mailto:gp@webbing.ch" className="inline-flex min-h-11 items-center gap-2 rounded-sm underline underline-offset-4"><Mail aria-hidden="true" className="h-4 w-4" />gp@webbing.ch</a>
            <a href="tel:+41793414074" className="inline-flex min-h-11 items-center gap-2 rounded-sm underline underline-offset-4"><Phone aria-hidden="true" className="h-4 w-4" />+41 79 341 40 74</a>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <form
            onSubmit={handleSubmit}
            aria-labelledby="contact-title"
            aria-describedby={submitError ? "form-intro contact-error" : "form-intro"}
            aria-busy={isSubmitting}
            className="min-w-0 space-y-6 lg:col-start-2 lg:row-start-1"
          >
            <p id="form-intro" className="text-base leading-relaxed text-muted-foreground">
              Décrivez votre projet, nous vous répondrons rapidement
            </p>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-base leading-normal">Prénom (obligatoire)</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  aria-required="true"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-12 border-muted-foreground text-base md:text-base motion-reduce:transition-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-base leading-normal">Nom (obligatoire)</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  aria-required="true"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-12 border-muted-foreground text-base md:text-base motion-reduce:transition-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
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
              <div className="space-y-2">
                <Label htmlFor="company" className="text-base leading-normal">Entreprise</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base leading-normal">Sujet (obligatoire)</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                autoComplete="off"
                required
                aria-required="true"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="h-12 border-muted-foreground text-base md:text-base motion-reduce:transition-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-base leading-normal">Message (obligatoire)</Label>
              <Textarea
                id="message"
                name="message"
                autoComplete="off"
                required
                aria-required="true"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="min-h-40 resize-y border-muted-foreground text-base md:text-base motion-reduce:transition-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full sm:w-auto sm:min-w-56"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer le message
                  <Send aria-hidden="true" />
                </>
              )}
            </Button>
            {submitError && (
              <p id="contact-error" className="text-base text-destructive" role="alert">
                {submitError}
              </p>
            )}
          </form>

          <aside className="min-w-0 border-t border-border pt-10 lg:col-start-1 lg:row-start-1 lg:border-t-0 lg:pt-0" aria-labelledby="contact-details-title">
            <h2 id="contact-details-title" className="section-heading">Nos coordonnées</h2>
            <dl className="mt-8 space-y-7 text-base">
              <div>
                <dt className="flex items-center gap-3 font-medium text-foreground">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                  Email
                </dt>
                <dd className="mt-2">
                  <a href="mailto:gp@webbing.ch" className="inline-flex min-h-11 items-center rounded-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none">
                    gp@webbing.ch
                  </a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-medium text-foreground">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Téléphone
                </dt>
                <dd className="mt-2">
                  <a href="tel:+41793414074" className="inline-flex min-h-11 items-center rounded-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none">
                    +41 79 341 40 74
                  </a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-medium text-foreground">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  Localisation
                </dt>
                <dd className="mt-3 leading-relaxed text-muted-foreground">
                  Rue de Battentin 1, 1630 Bulle
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
