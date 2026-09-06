import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });

    // Borra acompañantes vinculados primero y luego la respuesta
    await prisma.companion.deleteMany({ where: { responseId: id } });
    await prisma.guestResponse.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar respuesta" }, { status: 500 });
  }
}