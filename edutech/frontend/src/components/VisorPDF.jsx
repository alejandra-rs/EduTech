export default function VisorPDF({ pdfUrl, titulo = "Visualizador de documento PDF" }) {
  return (
    <div className="w-full flex justify-center items-start p-2">
      <div className="w-full max-w-3xl aspect-[1/1.4142] h-auto bg-zinc-200 border border-zinc-300 rounded-lg overflow-hidden shadow-md flex justify-center items-center relative">
        
        {pdfUrl ? (
          <iframe 
            src={`${pdfUrl}#view=FitH`} 
            title={titulo}
            className="absolute top-0 left-0 w-full h-full border-0"
          />
        ) : (
          <div className="flex flex-col items-center text-zinc-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p className="text-sm">Documento no disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}