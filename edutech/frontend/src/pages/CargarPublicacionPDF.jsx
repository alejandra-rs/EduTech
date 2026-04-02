import Header from '../components/Header';
import VisorPDF from '../components/VisorPDF';
import PublicacionFooter from '../components/PublicacionFooter';

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
            <form className="space-y-6 w-full">
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subir archivo</label>
                  <input type="text" placeholder="Value" className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                  <input type="text" placeholder="Value" className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea 
                    placeholder="Value..." 
                    rows="8" 
                    className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none resize-none transition-all"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ruta</label>
                  <input type="text" placeholder="Value/Value/Value..." className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all" />
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-[#2d2d2d] hover:bg-black text-white text-sm py-4 rounded-lg transition-all duration-200 flex justify-center items-center font-bold uppercase tracking-[0.2em] shadow-lg">
                  Publicar
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