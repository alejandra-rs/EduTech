import VisorVideo from "../components/VisorVideo";
import Input from "../components/Input";
import { TitlePage } from '../components/TitlePage';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getUserId, postDocument } from "@services/connections";

export default function CargarPublicacionVideo() {
  const navigate = useNavigate();
  const { id, subjectId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleBack = () => navigate(`/${id}/${subjectId}/post`);

  const handlePublish = async (e) => {
    e.preventDefault();
    const idUsuarioActual = await getUserId();
    postDocument(subjectId, idUsuarioActual, title, description, "VID", selectedFile);
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="w-full shrink-0 bg-transparent">
          <TitlePage PageName="Cargar Publicación" onBack={handleBack} />
        </div>
        <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
          <form
            className="w-full space-y-8"
            onSubmit={(e) => handlePublish(e)}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Input
                  label="Pegar URL"
                  placeholder="https://youtube.com/..."
                  onChange={(e) => setSelectedFile(e.target.value)}
                  />
              </div>
              <div className="flex-1">
                <Input
                  label="Título"
                  placeholder="Introduce el título del video"
                  onChange={(e) => setTitle(e.target.value)}
                  />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-[40%] xl:w-[35%] shrink-0">
                <VisorVideo videoUrl={selectedFile}/>
              </div>
              <div className="flex-1 w-full">
                <Input
                  label="Descripción"
                  placeholder="Escribe una breve descripción del video..."
                  rows={10}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
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
