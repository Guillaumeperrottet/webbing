import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { track } from "@vercel/analytics/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, message, service, company } = body;

    // Envoi de l'email via Resend
    const data = await resend.emails.send({
      from: "contact@webbing.ch", // Remplace par ton domaine vérifié
      to: "gp@webbing.ch", // Remplace par l'adresse de réception
      subject: `Nouvelle prise de contact`,
      reply_to: email,
      text: message,
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
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
