'use client';
import { useState, useEffect } from 'react';
import { Gift, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function RSVPForm({ invitation }: { invitation: any }) {
  const [status, setStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | null>(null);
  const [name, setName] = useState('');
  const [companionsCount, setCompanionsCount] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`rsvp_${invitation.id}`)) setIsSubmitted(true);
  }, [invitation.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          invitationId: invitation.id, 
          name, 
          status, 
          companionsCount, 
          companionNames 
        })
      });

      if (res.ok) {
        localStorage.setItem(`rsvp_${invitation.id}`, status || '');
        setIsSubmitted(true);
      } else {
        alert("Ocurrió un error. Verifica que las confirmaciones sigan abiertas.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetResponse = () => {
    localStorage.removeItem(`rsvp_${invitation.id}`);
    setIsSubmitted(false);
    setStatus(null);
    setName('');
    setCompanionsCount(0);
    setCompanionNames([]);
  };

  if (isSubmitted) {
    const savedStatus = localStorage.getItem(`rsvp_${invitation.id}`) || status;
    return (
      <div className="p-8 text-center bg-white/90 backdrop-blur rounded-xl shadow-lg mt-10 max-w-md mx-auto">
        {savedStatus === 'ATTENDING' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-serif mb-2 text-gray-900">¡Gracias por confirmar! ❤️</h3>
            <p className="text-gray-700 mb-6">Nos alegra muchísimo saber que nos acompañarás.</p>
            {invitation.giftUrl && (
              <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <Gift className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                <h4 className="font-bold text-gray-800 mb-2">Mesa de Regalos</h4>
                <p className="text-sm text-gray-600 mb-4">{invitation.giftText}</p>
                <a href={invitation.giftUrl} target="_blank" rel="noopener noreferrer" 
                   className="inline-block px-6 py-2 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition">
                  VER LISTA DE REGALOS
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-serif mb-2 text-gray-900">Gracias por informarnos</h3>
            <p className="text-gray-600">Sentimos mucho que no puedas acompañarnos.</p>
          </>
        )}

        {/* Botón para cambiar la respuesta */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={handleResetResponse}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1.5 mx-auto font-medium transition"
          >
            <RefreshCw size={12} /> ¿Quieres cambiar o editar tu respuesta?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl text-gray-900">
      <h3 className="text-2xl font-serif text-center mb-6">¿Nos acompañas?</h3>
      {!status ? (
        <div className="flex gap-4 justify-center">
          <button onClick={() => setStatus('ATTENDING')} className="px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 shadow-lg transition transform hover:scale-105">❤️ SÍ, ASISTIRÉ</button>
          <button onClick={() => setStatus('NOT_ATTENDING')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition">😢 NO PODRÉ</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 bg-white" placeholder="Ej. Juan Pérez" />
          </div>
          
          {status === 'ATTENDING' && invitation.maxCompanions > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Acompañantes (Max: {invitation.maxCompanions})</label>
              <select value={companionsCount} onChange={(e) => setCompanionsCount(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg bg-white">
                {Array.from({ length: invitation.maxCompanions + 1 }).map((_, i) => (
                  <option key={i} value={i}>{i} acompañante{i !== 1 && 's'}</option>
                ))}
              </select>
            </div>
          )}

          {status === 'ATTENDING' && Array.from({ length: companionsCount }).map((_, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Acompañante {i + 1}</label>
              <input required type="text" onChange={(e) => {
                const newNames = [...companionNames];
                newNames[i] = e.target.value;
                setCompanionNames(newNames);
              }} className="w-full px-4 py-2 border rounded-lg bg-white" />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setStatus(null)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Volver</button>
            <button type="submit" disabled={loading} className="flex-1 bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Enviando...' : 'Confirmar Respuesta'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}