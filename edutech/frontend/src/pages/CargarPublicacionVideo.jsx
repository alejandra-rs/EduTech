import Header from '../components/Header';
import VisorVideo from '../components/VisorVideo';
import PublicacionFooter from '../components/PublicacionFooter';

export default function CargarPublicacionVideo() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Header />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
          <form className="w-full space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pegar URL</label>
                <input type="text" placeholder="Value" className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                <input type="text" placeholder="Value" className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all" />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-[40%] xl:w-[35%] shrink-0">
                <VisorVideo />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea 
                  placeholder="Value..." 
                  rows="10" 
                  className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none resize-none transition-all"
                ></textarea>
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ruta</label>
              <input type="text" placeholder="Value/Value/Value..." className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all" />
            </div>
            <div className="pt-4">
              <button className="w-full bg-[#2d2d2d] hover:bg-black text-white text-sm py-4 rounded-lg transition-all duration-200 flex justify-center items-center font-bold uppercase tracking-[0.2em] shadow-lg">
                Publicar
              </button>
            </div>
          </form>
        </main>
        <PublicacionFooter />
      </div>
    </div>
  );
}