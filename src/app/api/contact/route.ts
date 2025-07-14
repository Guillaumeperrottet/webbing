import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Envoi de l'email via Resend
    const data = await resend.emails.send({
      from: "contact@webbing.ch", // Remplace par ton domaine vérifié
      to: "perrottet.guillaume.97@gmail.com", // Remplace par l'adresse de réception
      subject: `Nouveau message de ${name}`,
      reply_to: email,
      text: message,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
