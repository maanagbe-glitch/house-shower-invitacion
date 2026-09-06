import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import RSVPForm from '@/components/RSVPForm';
import { MapPin, Calendar, Clock } from 'lucide-react';

const prisma = new PrismaClient();

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const invitation = await prisma.invitation.findUnique({ where: { slug: resolvedParams.slug } });
  
  if (!invitation) notFound();

  // Lee el campo guardado en BD o asigna /foto.jpeg por defecto
  const imageUrl = invitation.imageUrl || "/foto.jpeg";

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 font-serif pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-8 relative z-10">
        
        {/* Banner / Foto Principal */}
        <div className="w-full h-72 md:h-96 rounded-t-3xl overflow-hidden shadow-xl border-b-4 border-rose-300 bg-gray-200">
          <img 
            src={imageUrl} 
            alt="Foto de Michael y Cindy" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-b-3xl p-8 md:p-12 text-center text-gray-900 mb-8">
          <p className="text-xs uppercase tracking-widest text-rose-500 font-bold mb-2">{invitation.title}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">{invitation.hosts}</h1>
          <p className="text-lg leading-relaxed mb-10 text-gray-600 italic whitespace-pre-wrap">
            {invitation.invitationText}
          </p>

          <div className="space-y-6 text-left border-y border-gray-100 py-8">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-rose-400" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Fecha</p>
                <p className="text-gray-600">{new Date(invitation.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-rose-400" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Hora</p>
                <p className="text-gray-600">{invitation.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-rose-400" />
              <div>
                <p className="font-bold text-gray-800 text-sm">{invitation.locationName}</p>
                <p className="text-sm text-gray-500">{invitation.address}</p>
              </div>
            </div>
          </div>
        </div>

        {invitation.rsvpActive ? (
          <RSVPForm invitation={invitation} />
        ) : (
          <div className="mt-10 p-6 bg-gray-100 rounded-xl text-center text-gray-600">
            Las confirmaciones de asistencia ya están cerradas.
          </div>
        )}
      </div>
    </main>
  );
}