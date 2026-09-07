import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Users, UserCheck, UserX, Share2, ExternalLink, Gift, Edit, FileSpreadsheet, QrCode, Trash2 } from 'lucide-react';

const prisma = new PrismaClient();

// Acción del servidor para borrar la respuesta (Prisma elimina acompañantes en cascada)
async function deleteGuest(formData: FormData) {
  'use server';
  const id = formData.get('guestId') as string;
  if (!id) return;

  try {
    await prisma.guestResponse.delete({ where: { id } });
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error("Error borrando registro:", error);
  }
}

export default async function AdminDashboard() {
  const invitations = await prisma.invitation.findMany({
    include: { 
      responses: { 
        include: { companions: true },
        orderBy: { createdAt: 'desc' }
      } 
    }
  });

  const mainInvitation = invitations[0];
  const confirmed = mainInvitation?.responses.filter(r => r.status === 'ATTENDING') || [];
  const declined = mainInvitation?.responses.filter(r => r.status === 'NOT_ATTENDING') || [];
  const totalPeople = confirmed.reduce((acc, curr) => acc + 1 + curr.companionsCount, 0);

  const publicUrl = mainInvitation ? `http://localhost:3000/i/${mainInvitation.slug}` : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicUrl)}`;
  const whatsappText = encodeURIComponent(`💌 ¡Hola! Queremos invitarte a celebrar con nosotros nuestro House Shower. Confirma tu asistencia aquí:\n${publicUrl}`);
  const whatsappLink = `https://api.whatsapp.com/send?text=${whatsappText}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 text-gray-900">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel Administrativo</h1>
          <p className="text-gray-500 text-sm">Gestión del House Shower de Michael & Cindy</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/export" className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-800 transition shadow-sm">
            <FileSpreadsheet size={16} /> Descargar Excel
          </a>
          <a href={qrUrl} target="_blank" download="qr-invitacion.png" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm">
            <QrCode size={16} /> Descargar QR
          </a>
        </div>
      </header>

      {mainInvitation && (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{mainInvitation.title}</h2>
                  <p className="text-gray-500 text-sm">Anfitriones: {mainInvitation.hosts}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {mainInvitation.rsvpActive ? 'RSVP Activo' : 'Cerrado'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-green-50 p-3.5 rounded-xl border border-green-100">
                  <div className="flex items-center gap-1.5 text-green-700 text-xs font-medium mb-1"><UserCheck size={16}/> Confirmados</div>
                  <div className="text-2xl font-bold text-green-900">{confirmed.length}</div>
                </div>
                <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-1.5 text-rose-700 text-xs font-medium mb-1"><UserX size={16}/> No Asistirán</div>
                  <div className="text-2xl font-bold text-rose-900">{declined.length}</div>
                </div>
                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-1.5 text-blue-700 text-xs font-medium mb-1"><Users size={16}/> Total Personas</div>
                  <div className="text-2xl font-bold text-blue-900">{totalPeople}</div>
                </div>
              </div>

              {mainInvitation.giftUrl && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                  <Gift size={16} className="text-amber-600 flex-shrink-0" />
                  <span className="truncate">Lista Regalos: <a href={mainInvitation.giftUrl} target="_blank" rel="noreferrer" className="underline font-medium">Ver Enlace Externe</a></span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-2.5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <Link href="/admin/invitations/edit" className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
                <Edit size={16} /> Editar Datos del Evento
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-emerald-700 transition">
                <Share2 size={16} /> Compartir por WhatsApp
              </a>
              <Link href={`/i/${mainInvitation.slug}`} target="_blank" className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                <ExternalLink size={16} /> Ver Invitación Pública
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">Listado Detallado de Respuestas</h3>
              <p className="text-xs text-gray-500">Invitados que han respondido desde la web</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Invitado</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Acompañantes</th>
                    <th className="px-6 py-3">Total Asistentes</th>
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mainInvitation.responses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Aún no hay respuestas registradas.</td>
                    </tr>
                  ) : (
                    mainInvitation.responses.map(resp => (
                      <tr key={resp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{resp.name}</td>
                        <td className="px-6 py-4">
                          {resp.status === 'ATTENDING' ? (
                            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">Confirmado</span>
                          ) : (
                            <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-1 rounded-full font-semibold">No Asistirá</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {resp.companions.length > 0 
                            ? resp.companions.map(c => c.name).join(', ')
                            : 'Ninguno'}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">
                          {resp.status === 'ATTENDING' ? 1 + resp.companionsCount : 0}
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(resp.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <form action={deleteGuest} className="inline">
                            <input type="hidden" name="guestId" value={resp.id} />
                            <button 
                              type="submit" 
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Eliminar respuesta"
                            >
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}