import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { track } from "@vercel/analytics/server";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  company: z.string().trim().optional(),
  subject: z.string().trim().min(1),
  message: z.string().trim().min(1),
  service: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = contactSchema.parse(await request.json());
    const { firstName, lastName, email, message, service, company, subject } =
      body;

    // Envoi de l'email via Resend
    const data = await resend.emails.send({
      from: "contact@webbing.ch",
      to: "gp@webbing.ch",
      subject: `Nouvelle prise de contact : ${subject}`,
      reply_to: email,
      text: [
        `Nom: ${firstName} ${lastName}`,
        `Email: ${email}`,
        company ? `Entreprise: ${company}` : null,
        service ? `Service: ${service}` : null,
        `Sujet: ${subject}`,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Track server-side event
    await track("Contact Email Sent", {
      service: service || "not_specified",
      hasCompany: !!company,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
