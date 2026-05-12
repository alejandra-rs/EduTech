import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitlePage } from '../components/TitlePage';
import { RevisionWidget } from '../components/revision/RevisionWidget';
import { useCurrentUser } from '../services/useCurrentUser';

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
  
  // Mantenemos esto para luego, pero ahora usaremos mocks
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

  // COMENTADA PARA DESARROLLO
  /*
  useEffect(() => {
    if (!userLoading && (!userData || !userData.is_admin)) navigate('/');
  }, [userData, userLoading, navigate]);
  */

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

  // Quitamos la pausa de loading de usuario para que no se quede bloqueado
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
            <RevisionWidget
              key={item.id}
              draft={item}
              onPublish={() => handlePublish(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
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