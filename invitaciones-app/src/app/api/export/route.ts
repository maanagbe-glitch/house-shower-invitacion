import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const responses = await prisma.guestResponse.findMany({
      include: { companions: true },
      orderBy: { createdAt: 'desc' }
    });

    const headers = ['Nombre', 'Estado', 'Acompañantes', 'Nombres Acompañantes', 'Total Personas', 'Fecha Respuesta'];
    
    const rows = responses.map(r => [
      `"${r.name}"`,
      `"${r.status === 'ATTENDING' ? 'CONFIRMADO' : 'NO ASISTIRÁ'}"`,
      r.companionsCount,
      `"${r.companions.map(c => c.name).join(', ')}"`,
      r.status === 'ATTENDING' ? 1 + r.companionsCount : 0,
      `"${new Date(r.createdAt).toLocaleDateString('es-ES')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="invitados-house-shower.csv"',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Error generando lista" }, { status: 500 });
  }
}