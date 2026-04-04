import { use, useState } from "react";
import Header from "./Header";
import NotebookFooter from "./Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs_config = {
    default: [
      { label: "Mis asignaturas", color: "bg-red-400" },
      { label: "Mi espacio", color: "bg-yellow-400" },
      { label: "Todos", color: "bg-green-400" },
    ],
    "/cargarPublicacion": [
      // Si la URL de cargarPublicacionPDF o Video cambia debe el nombre
      { label: "PDF", color: "bg-red-400" },
      { label: "Video", color: "bg-blue-400" },
    ],
  };

  const location = useLocation();
  const currentTabs =
    tabs_config[
      location.pathname.endsWith("/cargarPublicacion")
        ? "/cargarPublicacion" // Si la URL de cargarPublicacionPDF o Video cambia debe actualizar esta condición, minimo debe contender o terminar con esto
        : "default"
    ];

  return (
    <div className="flex h-screen w-full bg-slate-200 overflow-hidden">
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userProfilePic={null}
        userName={null}
      />
      <div className="flex flex-1 flex-col relative overflow-hidden">
        <main
          className={`flex-1 bg-white overflow-y-auto custom-scrollbar 
             transition-all duration-300`}
        >
          <div className="min-h-full flex flex-col pb-10">
            <div className="flex-1">{children}</div>
            <div
              className="h-10 shrink-0 pointer-events-none"
              aria-hidden="true"
            />{" "}
          </div>
        </main>
        <div className="absolute bottom-0 left-0 w-full z-20 bg-transparent">
          <NotebookFooter tabs={currentTabs} />
        </div>
      </div>
    </div>
  );
}
