import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { PlusCircleIcon, DocumentTextIcon, PlayCircleIcon, ClipboardDocumentListIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";
import SearchBar from "../components/SearchBar";
import BellButton from "../components/interactions/BellButton";
import Tabs from "../components/Tabs";
import PostGrid from "../components/PostGrid";
import { TitlePage } from "../components/TitlePage";
import { getPosts, getCourse } from "@services/connections";
import { getYearById, getDegreeInfo } from "@services/degree";

const TYPE_TO_TAB = { PDF: "pdf", VID: "video", QUI: "cuestionario", FLC: "flashcard" };

const SubjectDetail = () => {
  const { id, subjectId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTabs, setActiveTabs] = useState([]);
  const [subjectName, setSubjectName] = useState("Cargando...");
  const [degreeName, setDegreeName] = useState(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const uploadMenuRef = useRef(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataPosts, dataCourse] = await Promise.all([getPosts(subjectId), getCourse(subjectId)]);
        setPosts(dataPosts);
        if (dataCourse?.name) setSubjectName(dataCourse.name);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setSubjectName("Asignatura");
      }
    };
    if (subjectId) cargarDatos();
  }, [subjectId]);

  useEffect(() => {
    if (!id) return;
    getYearById(id)
      .then((year) => year?.degree ? getDegreeInfo(year.degree) : null)
      .then((info) => { if (info) setDegreeName(info.name); })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(e.target)) {
        setShowUploadMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePostClick = (post) => {
    switch (post.post_type) {
      case "PDF": navigate(`/${id}/${subjectId}/documento/${post.id}`); break;
      case "VID": navigate(`/${id}/${subjectId}/video/${post.id}`); break;
      case "QUI": navigate(`/${id}/${subjectId}/quiz/${post.id}`); break;
      case "FLA": navigate(`/${id}/${subjectId}/flashcard/${post.id}`); break;
      default: console.warn("Tipo de post desconocido:", post.post_type);
    }
  };

  const filteredPosts = (searchResults ?? posts).filter((post) => {
    if (activeTabs.length === 0) return true;
    return activeTabs.includes(TYPE_TO_TAB[post.post_type]);
  });

  const uploadOptions = [
    { label: "PDF", path: "PDF", icon: DocumentTextIcon },
    { label: "Video", path: "Video", icon: PlayCircleIcon },
    { label: "Cuestionario", path: "quiz", icon: ClipboardDocumentListIcon },
    { label: "Flashcards", path: "flashcard", icon: Square3Stack3DIcon },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white">
        <TitlePage
          PageName={subjectName}
          subtitle={degreeName}
          backLabel="Asignaturas"
          onBack={() => navigate(`/${id}/asignaturas`)}
        >
          <div className="relative" ref={uploadMenuRef}>
            <button
              onClick={() => setShowUploadMenu(v => !v)}
              className="text-gray-700 hover:text-blue-600 transition-all"
            >
              <PlusCircleIcon className="w-10 h-10" />
            </button>

            {showUploadMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2 overflow-hidden">
                {uploadOptions.map(({ label, path, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => { navigate(`/${id}/${subjectId}/upload/${path}`); setShowUploadMenu(false); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <BellButton subjectId={subjectId} />
        </TitlePage>
        <SearchBar
          placeholder="Buscar en esta asignatura..."
          color="bg-slate-800"
          courseId={subjectId}
          onSearch={setSearchResults}
        />
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        <div className="px-12 py-4 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
              <Tabs activeTabs={activeTabs} onTabChange={setActiveTabs} />
            </div>
            <PostGrid posts={filteredPosts} onPostClick={handlePostClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
