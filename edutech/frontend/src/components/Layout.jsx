import { use, useState } from "react";
import Header from "./Header";
import NotebookFooter from "./Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const tabs_config = {
    default: [
      { label: "Mis asignaturas", color: "bg-red-400", path: "/" },
      { label: "Mi espacio", color: "bg-yellow-400", path: "/" },
      { label: "Todos", color: "bg-green-400", path: "/" },
    ],
    upload: [
      { label: "PDF", color: "bg-red-400", subPath: "PDF" },
      { label: "Video", color: "bg-blue-400", subPath: "Video" },
    ],
  };

  const isUploadPath = location.pathname.toLowerCase().includes("/upload");
  const currentTabs = isUploadPath ? tabs_config.upload : tabs_config.default;

  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} userProfilePic={null} userName={null} />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="min-h-full flex flex-col">
            <div className="flex-1 bg-white">{children}</div>
            <div className="sticky bottom-0 left-0 w-full z-10">
              <NotebookFooter tabs={currentTabs || []} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}