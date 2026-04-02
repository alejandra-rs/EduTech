import Descargar from './components/Descargar'

export default function App() {

  return (
    <div className="min-h-screen w-full bg-gray-100 p-10 flex flex-col items-center">

        <Descargar 
          pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
          fileName="PDF_de_prueba.pdf" 
        />

    </div>
  )
}