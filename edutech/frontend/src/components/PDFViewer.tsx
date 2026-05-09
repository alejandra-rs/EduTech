export interface VisorPDFProps {
  pdfUrl?: string | null;
  titulo?: string;
}

export default function PDFViewer({ pdfUrl, titulo = "Visualizador de documento PDF" }: VisorPDFProps) {
  return (
    <div className="w-full h-full flex justify-center items-center bg-transparent">
      <div className="relative h-full w-auto aspect-[1/1.4142] max-w-full bg-zinc-200 border border-zinc-300 rounded-lg overflow-hidden shadow-md flex justify-center items-center">
        {pdfUrl ? (
          <iframe src={`${pdfUrl}#view=FitH`} title={titulo} className="absolute inset-0 w-full h-full border-0" />
        ) : (
          <div className="flex flex-col items-center text-zinc-400 p-10">
            <p className="text-sm">Documento no disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}
