import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { getUserByEmail } from "../services/connections";

export default function Layout({ accounts, instance, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  const tabs_config = {
    default: [
      { label: "Mis asignaturas", color: "bg-red-400" },
      { label: "Mi espacio", color: "bg-yellow-400" },
      { label: "Todos", color: "bg-green-400", path: "/" },
    ],
    upload: [
      { label: "PDF", color: "bg-red-400", path: "PDF" },
      { label: "Video", color: "bg-blue-400", path: "Video" },
      { label: "Cuestionario", color: "bg-orange-500", path: "quiz" }, 
      { label: "Flashcard", color: "bg-indigo-500", path: "flashcard" },
    ],
  };

  const isUploadPath = location.pathname.toLowerCase().includes("/upload");
  const currentTabs = isUploadPath ? tabs_config.upload : tabs_config.default;

  useEffect(() => {
    const fetchData = async () => {
      if (accounts.length > 0) {
        const user = await getUserByEmail(accounts[0].username);
        setUserData(user);
      }
    };

    fetchData();
  }, [accounts]);

  return (
    <div className="flex flex-row h-screen w-full bg-transparent vh100">
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userProfilePic={userData ? userData.picture : null}
        userName={userData ? userData.first_name : null}
        instance={instance}
        accountsMsal={accounts}
      />
      <main className="flex-1 relative h-screen bg-transparent transition-all duration-300">
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] mb-20 [scrollbar-width:none] bg-white ">
          {children}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <Footer tabs={currentTabs} />
        </div>
      </main>
    </div>
  );
}
