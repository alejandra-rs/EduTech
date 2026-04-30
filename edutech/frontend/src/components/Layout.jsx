import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { getUserByEmail } from "../services/connections";
import { checkIsAdmin } from "../services/connections";

export default function Layout({ accounts, instance, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const tabs_config = [
      { label: "PDF", color: "bg-red-400", path: "PDF" },
      { label: "Video", color: "bg-blue-400", path: "Video" },
      { label: "Cuestionario", color: "bg-orange-500", path: "quiz" },
      { label: "Flashcard", color: "bg-purple-500", path: "flashcard" },
  ];

  const isUploadPath = location.pathname.toLowerCase().includes("/upload");

  useEffect(() => {
    const fetchData = async () => {
      if (accounts.length > 0) {
        const user = await getUserByEmail(accounts[0].username);
        setUserData(user);
        if (user?.id) {
          const admin = await checkIsAdmin(user.id);
          setIsAdmin(admin);
        }
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
        isAdmin={isAdmin}
      />
      <main className="flex-1 relative h-screen bg-transparent transition-all duration-300">
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] mb-20 [scrollbar-width:none] bg-white ">
          {children}
        </div>
        {isUploadPath && (
          <div className="absolute bottom-0 left-0 w-full">
            <Footer tabs={tabs_config} />
          </div>
        )}
      </main>
    </div>
  );
}
