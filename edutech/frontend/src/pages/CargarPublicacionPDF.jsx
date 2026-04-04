import VisorPDF from '../components/VisorPDF';
import Input from '../components/Input';
import { TitlePage } from '../components/TitlePage'; 

export default function CargarPublicacionPDF() {
  const handleBack = () => window.history.back();
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="w-full shrink-0 bg-transparent">
          <TitlePage PageName="Cargar Publicación" onBack={handleBack} />
        </div>
        <main className="flex-1 flex flex-col lg:flex-row gap-8 px-4 md:px-8 lg:px-12 pt-4 pb-12 overflow-y-auto items-start">
          <div className="w-full lg:w-[23%] xl:w-[28%] aspect-[1/1.4142] shrink-0">
            <VisorPDF />
          </div>
          <div className="flex-1 w-full pl-0 lg:pl-8">
            <form className="space-y-6 w-full" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6">
                <Input label="Subir archivo" type="file" />
                <Input label="Título" placeholder="Introduce el título de la publicación" />
                <Input label="Descripción" placeholder="Escribe una breve descripción..." rows={8} />
                <Input label="Ruta" placeholder="Value/Value/Value..." />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#2d2d2d] hover:bg-black text-white text-sm py-4 rounded-lg transition-all duration-200 flex justify-center items-center font-bold uppercase tracking-[0.2em] shadow-lg"
                >Publicar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}