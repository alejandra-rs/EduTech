import { useState, useEffect } from "react";
import Header from "./Header";
import NotebookFooter from "./Footer";
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
    <div className="flex h-screen w-full  bg-transparent overflow-hidden">
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userProfilePic={userData ? userData.picture : null}
        userName={userData ? userData.first_name : null}
        instance={instance}
        accountsMsal={accounts}
      />
      <div className="flex flex-1 flex-col relative overflow-hidden">
        <main
          className={`flex-1overflow-y-auto custom-scrollbar 
             transition-all duration-300`}
        >
          <div className="min-h-full flex flex-col">
            <div className="flex-1 bg-white">{children}</div>
            <div className="sticky bottom-0 left-0 w-full z-10">
              <NotebookFooter tabs={currentTabs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
