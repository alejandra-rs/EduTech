import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import { AdminWidget } from '../components/reports/AdminWidget';
import { useCurrentUser } from '../services/useCurrentUser';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

/* 
import { getPendientesDeRevision, publicarDocumento, eliminarBorrador } from '../services/connections-revision'; 
*/

interface RevisionItem {
  id: number;
  title: string;
  subject: string;
  description: string;
  url: string;
}

export default function RevisionPage() {
  const [items, setItems] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { userData, isLoading: userLoading } = useCurrentUser();
  const navigate = useNavigate();

  const fetchRevisions = async () => {
    try {
      setLoading(true);
      /* LÓGICA REAL:
      const data = await getPendientesDeRevision(userData!.id);
      setItems(data);
      */

      // --- MOCK DATA PARA PROBAR ---
      const mockData: RevisionItem[] = [
        {
          id: 1,
          title: "Apuntes de Cálculo Integral - Tema 1",
          subject: "Matemáticas I",
          description: "Contiene todos los ejercicios resueltos de la primera semana de clase, incluyendo integrales por partes y sustitución.",
          url: "/path-to-pdf.pdf"
        },
        {
          id: 2,
          title: "Resumen Programación Orientada a Objetos",
          subject: "Programación",
          description: "Resumen de los conceptos de programación orientada a objetos y su implementación en Java.",
          url: "/programacion.pdf"
        }
      ];
      setItems(mockData);
    } catch (err) {
      console.error("Error al cargar revisiones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handlePublish = async (id: number) => {
    try {
      console.log("Publicando item:", id);
      /* await publicarDocumento(id, userData!.id); */
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error al publicar:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("Eliminando item:", id);
      /* await eliminarBorrador(id, userData!.id); */
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-gray-400 italic animate-pulse">Cargando revisiones (Modo Dev)...</p>
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
          items.map((item) => (
            <AdminWidget
              key={item.id}
              title={item.title}
              subtitle={item.subject}
              type="PDF"
              url={item.url}
              collapsible={true}
              actions={[
                {
                  label: 'Publicado',
                  confirmLabel: '¿Publicar?',
                  icon: CheckIcon,
                  variant: 'success',
                  onClick: () => handlePublish(item.id)
                },
                {
                  label: 'Eliminar',
                  confirmLabel: '¿Borrar?',
                  icon: TrashIcon,
                  variant: 'danger',
                  onClick: () => handleDelete(item.id)
                }
              ]}
            >
              <div className="text-sm text-gray-600 leading-relaxed">
                <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-1">Descripción del borrador</h4>
                <p>{item.description || "Sin descripción proporcionada."}</p>
              </div>
            </AdminWidget>
          ))
        ) : (
          <div className="mt-20 text-center">
            <p className="text-gray-400 italic">No hay documentos pendientes de revisión.</p>
          </div>
        )}
      </section>
    </div>
  );
}