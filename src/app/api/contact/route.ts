import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Ici vous pouvez intégrer avec votre service d'email
    // Par exemple: SendGrid, Resend, ou Nodemailer

    console.log("Nouveau message de contact:", body);

    // Simuler l'envoi d'email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
