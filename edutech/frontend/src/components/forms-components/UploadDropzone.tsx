import { useState, useRef, useEffect } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface UploadDropzoneProps {
  allowedType: "pdf" | "image";
  maxSizeKB: number;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  isConfirmed?: boolean;
}

export default function UploadDropzone({
  allowedType,
  maxSizeKB,
  selectedFile,
  onFileSelect,
  isConfirmed = false,
}: UploadDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const validateAndSetFile = (file: File | null) => {
    if (!file) return;
    if (file.size > maxSizeKB * 1024) {
      setError(`Supera el tamaño máximo de ${maxSizeKB} KB.`);
      onFileSelect(null);
      return;
    }
    setError("");
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  let boxClasses = "border-gray-300 bg-[#f8f9fa] hover:bg-gray-100";
  if (dragOver) boxClasses = "border-blue-500 bg-blue-50";
  if (error) boxClasses = "border-red-500 bg-red-50 text-red-600";
  if (isConfirmed) boxClasses = "border-transparent bg-transparent";

  return (
    <div className="w-full h-full">
      <div
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        onDrop={!isConfirmed ? handleDrop : undefined}
        onDragOver={!isConfirmed ? (e) => { e.preventDefault(); setDragOver(true); } : undefined}
        onDragLeave={!isConfirmed ? (e) => { e.preventDefault(); setDragOver(false); } : undefined}
        className={`w-full h-full border-2 ${isConfirmed ? 'border-solid' : 'border-dashed'} rounded-xl flex flex-col justify-center items-center transition-all relative overflow-hidden ${!selectedFile ? 'cursor-pointer group' : ''} ${boxClasses}`}
      >
        {selectedFile && previewUrl ? (
          <>
            <div className="absolute inset-0 w-full h-full p-1 lg:p-2">
              {allowedType === "image" ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg shadow-sm bg-white" />
              ) : (
                <iframe 
                  src={`${previewUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full rounded-lg shadow-sm border border-gray-200 bg-white" 
                  title="PDF Preview" 
                />
              )}
            </div>
            
            {!isConfirmed && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute top-4 right-4 bg-white/95 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow border border-gray-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 z-10"
              >
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span className="text-sm font-bold">Cambiar</span>
              </button>
            )}
          </>
        ) : (
          <div className="text-center px-4 flex flex-col items-center">
            <ArrowUpTrayIcon className={`w-12 h-12 mb-4 transition-transform ${error ? 'text-red-500' : 'text-gray-400 group-hover:-translate-y-2'}`} />
            <p className={`text-base font-medium ${error ? 'text-red-600' : 'text-gray-600'}`}>
              Haz clic o arrastra un PDF aquí
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) validateAndSetFile(e.target.files[0]);
          e.target.value = ''; 
        }}
      />
    </div>
  );
}