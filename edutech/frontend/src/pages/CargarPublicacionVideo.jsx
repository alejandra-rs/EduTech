import Header from "../components/Header";
import VisorVideo from "../components/VisorVideo";
import PublicacionFooter from "../components/PublicacionFooter";
import Input from "../components/input";

export default function CargarPublicacionVideo() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
          <form
            className="w-full space-y-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Input
                  label="Pegar URL"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Título"
                  placeholder="Introduce el título del video"
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-[40%] xl:w-[35%] shrink-0">
                <VisorVideo />
              </div>
              <div className="flex-1 w-full">
                <Input
                  label="Descripción"
                  placeholder="Escribe una breve descripción del video..."
                  rows={10}
                />
              </div>
            </div>
            <div className="w-full">
              <Input label="Ruta" placeholder="Value/Value/Value" />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#2d2d2d] hover:bg-black text-white text-sm py-4 rounded-lg transition-all duration-200 flex justify-center items-center font-bold uppercase tracking-[0.2em] shadow-lg"
              >
                Publicar
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
