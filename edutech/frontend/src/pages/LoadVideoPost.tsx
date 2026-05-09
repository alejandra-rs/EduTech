import VideoViewer from "../components/VideoViewer";
import Input from "../components/Input";
import { TitlePage } from '../components/TitlePage';
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { postVideo } from "../services/connections-documents";
import { useCurrentUser } from "../services/useCurrentUser";
import SuccessToast from "../components/SuccessToast";

export default function LoadVideoPost() {
  const navigate = useNavigate();
  const { userData } = useCurrentUser();
  const { id, subjectId } = useParams<{ id: string; subjectId: string }>();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);

  const handleBack = () => navigate(`/${id}/${subjectId}/post`);

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData?.id) return;
    await postVideo({ post_type: 'VID', courseId: Number(subjectId), studentId: userData.id, title, description, url: selectedFile });
    setPublished(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {published && (
        <SuccessToast
          message="¡Publicación exitosa!"
          onClose={() => navigate(`/${id}/${subjectId}/post`)}
        />
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="w-full shrink-0 bg-transparent">
          <TitlePage PageName="Cargar Publicación" onBack={handleBack} />
        </div>
        <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
          <form
            className="w-full space-y-8"
            onSubmit={handlePublish}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Input
                  label="Pegar URL"
                  placeholder="https://youtube.com/..."
                  onChange={(e: React.FormEvent) => setSelectedFile((e.target as HTMLInputElement).value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Título"
                  placeholder="Introduce el título del video"
                  onChange={(e: React.FormEvent) => setTitle((e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-[40%] xl:w-[35%] shrink-0">
                <VideoViewer videoUrl={selectedFile} />
              </div>
              <div className="flex-1 w-full">
                <Input
                  label="Descripción"
                  placeholder="Escribe una breve descripción del video..."
                  rows={10}
                  onChange={(e: React.FormEvent) => setDescription((e.target as HTMLTextAreaElement).value)}
                />
              </div>
            </div>
            <div className="bottom-0 right-0 w-full flex justify-end">
              <button
                type="submit"
                className="w-[8em] bg-[#2d2d2d] hover:bg-black text-white text-sm py-4 rounded-lg transition-all duration-200 flex justify-center items-center font-bold uppercase tracking-[0.2em] shadow-lg"
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
