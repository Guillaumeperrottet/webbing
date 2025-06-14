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
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
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
                  Merci pour votre message. Notre équipe vous répondra dans les
                  plus brefs délais.
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
      {/* Hero Section - Version sobre */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm bg-slate-50 border-slate-200 text-slate-700"
            >
              Parlons de votre projet
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Contactez-nous
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Vous avez des questions sur nos solutions ? Vous souhaitez une
              démonstration personnalisée ? Notre équipe est là pour vous
              accompagner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="text-center border-slate-200 shadow-sm h-full">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4 mx-auto">
                    <Mail className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-2">
                    <a
                      href="mailto:contact@webbing.ch"
                      className="hover:text-slate-900 transition-colors"
                    >
                      contact@webbing.ch
                    </a>
                  </p>
                  <p className="text-sm text-slate-500">Réponse sous 24h</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center border-slate-200 shadow-sm h-full">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4 mx-auto">
                    <MapPin className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">
                    Localisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-2">Genève, Suisse</p>
                  <p className="text-sm text-slate-500">
                    Solutions hébergées localement
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center border-slate-200 shadow-sm h-full">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4 mx-auto">
                    <Clock className="h-6 w-6 text-slate-700" />
                  </div>
                  <CardTitle className="text-lg text-slate-900">
                    Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-2">Lun - Ven : 9h - 18h</p>
                  <p className="text-sm text-slate-500">Horaires CET</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-900">
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons
                  rapidement
                </CardDescription>
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
                        <SelectItem value="both">Les deux solutions</SelectItem>
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

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-slate-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                question:
                  "Combien de temps faut-il pour déployer une solution ?",
                answer:
                  "Le déploiement varie selon la complexité de vos besoins. En général, PlanniKeeper peut être opérationnel en 2-3 semaines, tandis que Chaff nécessite 3-6 semaines selon les intégrations requises.",
              },
              {
                question: "Vos solutions sont-elles conformes au RGPD ?",
                answer:
                  "Absolument. Toutes nos solutions sont développées et hébergées en Suisse, avec une conformité totale au RGPD. Vos données restent sous contrôle suisse.",
              },
              {
                question: "Proposez-vous une période d'essai ?",
                answer:
                  "Oui, nous proposons une démonstration complète et personnalisée de nos solutions. Pour certains cas, nous pouvons également organiser un pilote limité dans le temps.",
              },
              {
                question: "Quel type de support proposez-vous ?",
                answer:
                  "Nous offrons un support complet incluant la formation initiale, une assistance technique réactive, et un accompagnement stratégique pour optimiser l'utilisation de nos solutions.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
