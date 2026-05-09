import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../services/useCurrentUser';
import { resolveReport } from '../services/interactions/connections-reports';
import { TitlePage } from '../components/TitlePage';
import Input from '../components/Input';
import UploadImage from '../components/UploadImage';
import { useEffect } from 'react';

export default function ReportFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [reason, setReason] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { userData } = useCurrentUser();
  const contentTitle = location.state?.title || 'Contenido seleccionado';
  const contentSubject = location.state?.subject || '';

  useEffect(() => {
    if (userData && !userData.is_admin) navigate('/');
  }, [userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?.id) return;
    setIsDeleting(true);
    setError('');
    try {
      await resolveReport(Number(id), reason, userData.id, image);
      navigate('/reports');
    } catch {
      setError('No se pudo procesar el reporte. Inténtalo de nuevo.');
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen items-center justify-center gap-6">
      <TitlePage PageName="Confirmar eliminación" onBack={() => navigate(-1)} />
      <form onSubmit={handleSubmit} className="p-6 gap-5 flex flex-col">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Material a retirar</label>
          <div className="bg-red-50 border-l-2 border-red-500 p-3 rounded-r-lg">
            <p className="text-red-900 font-bold text-sm">
              {contentTitle}{contentSubject && <span className="font-normal"> — {contentSubject}</span>}
            </p>
          </div>
        </div>
        <Input
          label="Explicación para el autor"
          placeholder="Explique el motivo..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required textarea autoResize
        />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Adjuntar imágenes (Opcional)</label>
          <UploadImage onFileChange={setImage} />
        </div>

        {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

        <div className="flex gap-6 justify-end pt-4">
          <button
            type="button" onClick={() => navigate(-1)}
            className="px-3 py-3 rounded-lg font-semibold text-gray-400 hover:bg-gray-100 transition-colors text-md"
          >
            Cancelar
          </button>
          <button
            type="submit" disabled={isDeleting}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-semibold text-white transition-all text-md ${
              isDeleting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-50'
            }`}
          >
            {isDeleting ? 'Borrando...' : 'Confirmar y Borrar'}
          </button>
        </div>
      </form>
    </main>
  );
}
