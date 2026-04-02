import VisorPDF from './components/VisorPDF'

export default function App() {
  const pdfPrueba = "https://arxiv.org/pdf/2203.15556.pdf";

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-10 flex flex-col items-center">
      
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Vista Previa (Proporción A4)
      </h1>

      <div className="w-full max-w-3xl">
        <VisorPDF pdfUrl={pdfPrueba} />
      </div>

    </div>
  )
}