import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import SearchBar from "../components/SearchBar";
import BellButton from "../components/BellButton";
import Tabs from "../components/Tabs";
import PostGrid from "../components/PostGrid";
import NotebookFooter from "../components/Footer";
import { TitlePage } from "../components/TitlePage";

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [activeTabs, setActiveTabs] = useState([]);

  const [isSubscribed, setIsSubscribed] = useState(() => {
    const saved = localStorage.getItem(`sub-${subjectId}`);
    return saved === "true";
  });

  const handleToggleSubscription = () => {
    const newState = !isSubscribed;
    setIsSubscribed(newState);
    localStorage.setItem(`sub-${subjectId}`, newState);
  };

  const dummyPosts = [
    { id: 1, title: "Apuntes Tema 1", type: "pdf", date: "2026-03-20", fileUrl: "https://www.w3.org/dummy.pdf" },
    { id: 2, title: "Resumen Final", type: "pdf", date: "2026-03-22", fileUrl: "https://www.w3.org/dummy2.pdf" },
    { id: 3, title: "Guía de estudio", type: "pdf", date: "2026-03-23", fileUrl: "https://www.w3.org/dummy3.pdf" },
    { id: 4, title: "Examen 2025", type: "pdf", date: "2026-03-24", fileUrl: "https://www.w3.org/dummy4.pdf" },
    { id: 5, title: "Explicación Tema 2", type: "video", date: "2026-03-21", fileUrl: "https://www.youtube.com/watch?v=7iobxzd_2wY&t=1s" },
    { id: 6, title: "Ejercicios Resueltos", type: "video", date: "2026-03-25", fileUrl: "https://youtu.be/7iobxzd_2wY?si=W8AwakVp7J0a2XL_" },
  ];

  const filteredPosts = dummyPosts.filter((post) => {
    if (activeTabs.length === 0) return true;
    return activeTabs.includes(post.type);
  });

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <div className="shrink-0 bg-white ">
        <TitlePage
          PageName={subjectId || "CALCULO"}
          onBack={() => navigate(-1)}
        >
          <PlusCircleIcon className="w-10 h-10" />
          <BellButton
            isSubscribed={isSubscribed}
            onClick={handleToggleSubscription}
          />
        </TitlePage>
        <SearchBar
          placeholder="Buscar en esta asignatura..."
          color="bg-slate-800"
        />
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
        <div className="px-12 py-4 flex-grow">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
              <Tabs activeTabs={activeTabs} onTabChange={setActiveTabs} />
            </div>

            <PostGrid posts={filteredPosts} />
          </div>
        </div>
        <div className="shrink-0">
          <NotebookFooter />
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
