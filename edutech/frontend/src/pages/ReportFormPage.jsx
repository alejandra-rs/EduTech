import React, { useState, useRef, useEffect } from 'react'; // Añadimos useEffect
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/solid';

export default function ReportFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null); 
  
  const [reason, setReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  
  const contentTitle = location.state?.title || "Contenido seleccionado";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [reason]);

  const validateAndSetFile = (file) => {
    setFileError('');
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Solo se admiten imágenes.');
      return;
    }
    if (file.size > 1024 * 1024 * 2) {
      setFileError('Máximo 2MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDeleting(true);
    setTimeout(() => {
      alert("Contenido eliminado con éxito.");
      navigate('/admin/reports');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        
        <div className="bg-gray-900 p-4 text-white">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeftIcon className="w-3 h-3" /> Volver
          </button>
          <h1 className="text-lg font-black uppercase tracking-tighter">
            Confirmar eliminación
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Material a retirar
            </label>
            <div className="bg-red-50 border-l-2 border-red-500 p-3 rounded-r-lg">
              <p className="text-red-900 font-bold text-sm leading-tight">{contentTitle}</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Explicación para el autor
            </label>
            <textarea
              ref={textareaRef}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explique el motivo..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-[13px] leading-relaxed text-gray-700 bg-gray-50/50 overflow-hidden"
            />
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Adjuntar evidencia (Opcional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragOver ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <PhotoIcon className={`w-8 h-8 mb-2 ${selectedFile ? 'text-green-500' : 'text-gray-300'}`} />
              {selectedFile ? (
                <p className="text-xs text-gray-700 font-bold">{selectedFile.name}</p>
              ) : (
                <div className="text-center">
                  <p className="text-[13px] text-gray-500">
                    <span className="text-red-600 font-bold">Sube una imagen o arrastra aquí</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG o JPG hasta 2MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => validateAndSetFile(e.target.files[0])}
            />
            {fileError && <p className="text-[11px] text-red-500 mt-2 font-bold uppercase">{fileError}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-3 py-3 rounded-lg font-bold text-gray-400 hover:bg-gray-100 transition-colors uppercase tracking-widest text-[9px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isDeleting}
              className={`flex-[2] flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-bold text-white transition-all uppercase tracking-widest text-[10px] ${
                isDeleting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-50'
              }`}
            >
              {isDeleting ? '...' : (
                <>
                  <PaperAirplaneIcon className="w-3 h-3" /> Confirmar y Borrar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}