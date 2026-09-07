import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { invitationId, name, status, companionsCount, companionNames } = body;

    if (!invitationId || !name || !status) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
      return NextResponse.json({ error: "La invitación no existe." }, { status: 404 });
    }

    if (invitation.rsvpActive === false) {
      return NextResponse.json({ error: "Las confirmaciones están cerradas." }, { status: 400 });
    }

    if (invitation.rsvpDeadline && new Date() > new Date(invitation.rsvpDeadline)) {
      return NextResponse.json({ error: "La fecha límite para confirmar ha pasado." }, { status: 400 });
    }

    // Asegurar que no supere el límite configurado por el admin
    const maxAllowed = invitation.maxCompanions || 0;
    const finalCompanionsCount = Math.min(Number(companionsCount) || 0, maxAllowed);

    const guestResponse = await prisma.guestResponse.create({
      data: {
        invitationId,
        name,
        status,
        companionsCount: status === 'ATTENDING' ? finalCompanionsCount : 0,
        companions: {
          create: status === 'ATTENDING' && finalCompanionsCount > 0 && Array.isArray(companionNames)
            ? companionNames.slice(0, finalCompanionsCount).map((n: string) => ({ name: n || 'Acompañante' }))
            : []
        }
      }
    });

    return NextResponse.json({ success: true, guestResponse });
  } catch (error) {
    console.error("Error en API RSVP:", error);
    return NextResponse.json({ error: "Error procesando la respuesta." }, { status: 500 });
  }
}