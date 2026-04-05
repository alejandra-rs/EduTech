import { useState } from 'react';
import { FlagIcon } from '@heroicons/react/24/solid';
import Input from './Input';

export default function ReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleOpen = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 200);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsReported(true);
    setIsOpen(false);
  };
  return (
    <>
      <div className="flex items-center gap-2 select-none group">
        <button
          onClick={handleOpen}
          title="Reportar publicación"
          className={`
            transition-all duration-200 
            ${animate ? 'scale-125' : 'scale-100'}
            ${isReported ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}
            p-1.5 rounded-full
            hover:bg-red-50
          `}
        >
          <FlagIcon className="w-7 h-7" />
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Reportar contenido</h3>
                <button 
                  onClick={handleClose} 
                  className="text-gray-400 hover:text-black text-3xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <Input 
                  label="Motivo del reporte" 
                  placeholder="Explica por qué este contenido infringe las normas..." 
                  rows={5} 
                />
                <div className="mt-8 flex gap-3">
                  <button 
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg"
                  >
                    Eviar Reporte
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}