// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          service: "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center border-slate-200 shadow-sm">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-slate-900">
                  Message envoyé !
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Merci pour votre message. Notre vous répondrons dans les plus
                  brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsSubmitted(false)}>
                  Envoyer un autre message
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm bg-white border-slate-200 text-slate-700"
            >
              Parlons de votre projet
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Contactez-nous
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Une question ? Besoin d&apos;informations ? Nous sommes à votre
              écoute
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Email */}
              <div className="flex items-center gap-3 md:justify-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left md:text-center">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:gp@webbing.ch"
                    className="text-sm text-slate-600 hover:text-primary transition-colors"
                  >
                    gp@webbing.ch
                  </a>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-3 md:justify-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left md:text-center">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Téléphone
                  </h3>
                  <a
                    href="tel:+41793414074"
                    className="text-sm text-slate-600 hover:text-primary transition-colors"
                  >
                    +41 79 341 40 74
                  </a>
                </div>
              </div>

              {/* Localisation */}
              <div className="flex items-center gap-3 md:justify-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left md:text-center">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Localisation
                  </h3>
                  <p className="text-sm text-slate-600">
                    Rue de Battentin 1, 1630 Bulle
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Separator text */}
      <section className="px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Ou écrivez-nous
            </h2>
            <p className="text-slate-600">
              Décrivez votre projet, nous vous répondrons rapidement
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-8 px-4 pb-16">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-900">
                  Formulaire de contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-700">
                        Prénom *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="border-slate-200 focus:border-slate-400"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-700">
                        Nom *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="border-slate-200 focus:border-slate-400"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="border-slate-200 focus:border-slate-400"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-slate-700">
                        Entreprise
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        className="border-slate-200 focus:border-slate-400"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-slate-700">
                      Solution qui vous intéresse
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        handleInputChange("service", value)
                      }
                    >
                      <SelectTrigger className="border-slate-200 focus:border-slate-400">
                        <SelectValue placeholder="Sélectionnez une solution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plannikeeper">
                          PlanniKeeper
                        </SelectItem>
                        <SelectItem value="chaff">Chaff</SelectItem>
                        <SelectItem value="selfkey">SelfKey</SelectItem>
                        <SelectItem value="selfcamp">SelfCamp</SelectItem>
                        <SelectItem value="all">
                          Toutes les solutions
                        </SelectItem>
                        <SelectItem value="other">Autre / Conseil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700">
                      Sujet *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      className="border-slate-200 focus:border-slate-400"
                      placeholder="L'objet de votre message"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      className="border-slate-200 focus:border-slate-400 min-h-[120px]"
                      placeholder="Décrivez votre projet, vos besoins ou vos questions..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-base py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
