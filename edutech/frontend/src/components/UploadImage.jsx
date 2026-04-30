import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function UploadImage({ onFileChange }) {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef(null);

    const validateAndSetFile = (file) => {
        setFileError('');
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) { setFileError('Solo se admiten imágenes.'); return; }
        if (file.size > 1024 * 200) { setFileError('Máximo 200KB.'); return; }
        setSelectedFile(file);
        onFileChange?.(file);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        fileInputRef.current.value = '';
        onFileChange?.(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        validateAndSetFile(e.dataTransfer.files[0]);
    };

    return (
        <>
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
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-700 font-bold">{selectedFile.name}</p>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-semibold">Sube una imagen o arrastra aquí</p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG o JPG hasta 200KB</p>
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
        </>
    );
}
