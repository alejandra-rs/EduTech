import VisorPDF from "../components/VisorPDF";
import Input from "../components/Input";
import { TitlePage } from "../components/TitlePage";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from 'react';
import { postDocument } from '../services/connections';
import { useCurrentUser } from "@services/useCurrentUser";

export default function CargarPublicacionPDF() {
  const navigate = useNavigate();
  const { id, subjectId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleBack = () => navigate(`/${id}/${subjectId}/post`);

  const handlePublish = async (e) => {
    e.preventDefault();
    const { userData } = useCurrentUser();
    postDocument(subjectId, userData.id, title, description, "PDF", selectedFile);
  };
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
            <form className="space-y-6 w-full" onSubmit={(e) => handlePublish(e)}>
              <div className="grid grid-cols-1 gap-6">
                <Input label="Subir archivo" type="file" onChange={(e) => setSelectedFile(e.target.files[0])}/>
                <Input label="Título" placeholder="Introduce el título de la publicación" onChange={(e) => setTitle(e.target.value)}/>
                <Input label="Descripción" placeholder="Escribe una breve descripción..." rows={8} onChange={(e) => setDescription(e.target.value)} />
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
          </div>
        </main>
      </div>
    </div>
  );
}
