import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, hosts, invitationText, date, time, locationName, address, maxCompanions, imageUrl, giftUrl, giftText } = body;

    const firstInvitation = await prisma.invitation.findFirst();
    if (!firstInvitation) return NextResponse.json({ error: "No se encontró la invitación" }, { status: 404 });

    await prisma.invitation.update({
      where: { id: firstInvitation.id },
      data: {
        title,
        hosts,
        invitationText,
        date: new Date(date),
        time,
        locationName,
        address,
        maxCompanions: Number(maxCompanions),
        imageUrl: imageUrl || "/foto.jpeg",
        giftUrl,
        giftText
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}