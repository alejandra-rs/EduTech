import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import { AdminWidget } from '../components/reports/AdminWidget';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getRevisionQueue, publishRevision, discardRevision } from '../services/connections-revision';
import type { RevisionItem } from '../models/documents/revision.model';

export default function RevisionPage() {
  const [items, setItems] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRevisions = async () => {
    try {
      setLoading(true);
      const data = await getRevisionQueue();
      setItems(data);
    } catch (err) {
      console.error("Error al cargar revisiones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handlePublish = async (noteId: number) => {
    try {
      await publishRevision(noteId);
      setItems(prev => prev.filter(item => item.id !== noteId));
    } catch (err) {
      console.error("Error al publicar:", err);
    }
  };

  const handleDiscard = async (noteId: number) => {
    try {
      await discardRevision(noteId);
      setItems(prev => prev.filter(item => item.id !== noteId));
    } catch (err) {
      console.error("Error al descartar:", err);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-gray-400 italic animate-pulse">Cargando revisiones...</p>
      </main>
    );
  }

  return (
    <div className="flex flex-col mx-auto px-4 gap-7 max-w-5xl">
      <TitlePage
        PageName="Panel de Revisión"
        onBack={() => navigate(-1)}
      />

      <section className="flex flex-col gap-4 px-2 md:px-10 mb-10">
        {items.length > 0 ? (
          items.map((item) => {
            const viewerUrl = `/${item.year_id}/${item.course_id}/documento/${item.post_id}`;

            return (
              <AdminWidget
                key={item.id}
                title={item.title}
                subtitle={item.reason || "Sin nota de revisión."}
                type="PDF"
                url={viewerUrl}
                collapsible={false}
                actions={[
                  {
                    label: 'Publicar',
                    confirmLabel: '¿Publicar?',
                    icon: CheckIcon,
                    variant: 'success',
                    onClick: () => handlePublish(item.id)
                  },
                  {
                    label: 'Descartar',
                    confirmLabel: '¿Descartar?',
                    icon: TrashIcon,
                    variant: 'danger',
                    onClick: () => handleDiscard(item.id)
                  }
                ]}
              />
            );
          })
        ) : (
          <div className="mt-20 text-center">
            <p className="text-gray-400 italic">No hay documentos pendientes de revisión.</p>
          </div>
        )}
      </section>
    </div>
  );
}
