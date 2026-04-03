import Header from '../components/Header';
import VisorPDF from '../components/VisorPDF';
import PublicacionFooter from '../components/PublicacionFooter';
import Input from '../components/input';

export default function CargarPublicacionPDF() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Header />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 flex flex-col lg:flex-row gap-8 p-4 md:p-8 lg:p-12 overflow-y-auto items-start">
          <div className="w-full lg:w-[37%] xl:w-[32%] shrink-0">
            <VisorPDF />
          </div>
          <div className="flex-1 w-full">
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
        <PublicacionFooter />
      </div>
    </div>
  );
}