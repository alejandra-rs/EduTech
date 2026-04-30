import { useState } from "react";

interface UrlValidatorInputProps {
  onConfirm: (url: string) => void;
  isConfirmed?: boolean;
  initialUrl?: string;
}

export default function UrlValidatorInput({ 
  onConfirm, 
  isConfirmed = false, 
  initialUrl = "" 
}: UrlValidatorInputProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState("");

  const handleConfirm = () => {
    // Regex básica para validar URLs
    const pattern = new RegExp('^(https?:\\/\\/)?'+ 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
      '(\\#[-a-z\\d_]*)?$','i'); 

    if (!pattern.test(url)) {
      setError("Por favor, introduce una URL válida (ej: https://...).");
      return;
    }
    setError("");
    onConfirm(url);
  };

  if (isConfirmed) {
    return (
      <div className="w-full">
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL del recurso</label>
        <input
          type="text"
          value={initialUrl}
          disabled
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full text-left">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Enlace (URL)</label>
        <input
          type="text"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          className={`w-full p-4 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
      
      <button
        onClick={handleConfirm}
        disabled={!url.trim()}
        className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
      >
        Confirmar URL
      </button>
    </div>
  );
}