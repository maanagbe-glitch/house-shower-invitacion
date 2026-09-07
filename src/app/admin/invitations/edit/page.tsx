'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditInvitationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: 'House Shower Michael & Cindy',
    hosts: 'Michael y Cindy',
    invitationText: '¡Nos mudamos! Queremos invitarte a celebrar con nosotros nuestro House Shower.',
    date: '2026-10-24',
    time: '15:00',
    locationName: 'Nuestro Nuevo Hogar',
    address: 'Calle Principal # 123',
    maxCompanions: 2,
    imageUrl: '/foto.jpeg',
    giftUrl: 'https://script.google.com/macros/s/AKfycbxIfb40jB8_ui7u2lQ7Au3NWU9BcFkrLe7qyVx2809qTMnXTIlFcMzwC5f0gTqn32qu/exec',
    giftText: 'Si deseas acompañarnos también con un detalle o regalo para nuestro nuevo hogar, puedes consultar nuestra lista interactiva.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/invitation/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setLoading(false);
    if (res.ok) {
      alert('¡Invitación actualizada con éxito!');
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      alert('Error al guardar cambios.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 max-w-3xl mx-auto text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Editar Invitación (House Shower)</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título del Evento</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Anfitriones</label>
            <input type="text" value={form.hosts} onChange={e => setForm({...form, hosts: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL o Nombre de la Foto Principal</label>
          <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Texto de Invitación</label>
          <textarea value={form.invitationText} onChange={e => setForm({...form, invitationText: e.target.value})} rows={3} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora</label>
            <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Máx. Acompañantes</label>
            <input type="number" min="0" max="10" value={form.maxCompanions} onChange={e => setForm({...form, maxCompanions: Number(e.target.value)})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lugar / Ubicación</label>
            <input type="text" value={form.locationName} onChange={e => setForm({...form, locationName: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Lista de Regalos (Google Apps Script)</label>
          <input type="url" value={form.giftUrl} onChange={e => setForm({...form, giftUrl: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm bg-white" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Texto Explicativo de Regalos</label>
          <textarea value={form.giftText} onChange={e => setForm({...form, giftText: e.target.value})} rows={2} className="w-full border rounded-lg p-2.5 text-sm bg-white" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 border rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">Cancelar</button>
          <button type="submit" disabled={loading} className="flex-1 bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Cambios del Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}