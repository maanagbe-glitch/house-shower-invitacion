'use client';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteGuestButton({ guestId }: { guestId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      const res = await fetch(`/api/guest/delete?id=${guestId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Error al eliminar.");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
      title="Eliminar respuesta"
    >
      <Trash2 size={16} />
    </button>
  );
}