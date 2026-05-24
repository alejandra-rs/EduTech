import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { checkIsAdmin } from "../services/connections-students";
import { useCurrentUser } from "../context/CurrentUserContext";
import type { IPublicClientApplication, AccountInfo } from "@azure/msal-browser";

export interface LayoutProps {
  accounts: AccountInfo[];
  instance: IPublicClientApplication;
  children: React.ReactNode;
}

export default function Layout({ accounts, instance, children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { userData } = useCurrentUser();
  const location = useLocation();

  const tabs_config = [
    { label: "PDF", color: "bg-red-400", path: "PDF" },
    { label: "Video", color: "bg-blue-400", path: "Video" },
    { label: "Cuestionario", color: "bg-orange-500", path: "quiz" },
    { label: "Flashcard", color: "bg-purple-500", path: "flashcard" },
  ];

  const isUploadPath = location.pathname.toLowerCase().includes("/upload");

  useEffect(() => {
    if (!userData) return;
    checkIsAdmin().then(setIsAdmin);
  }, [userData]);

  return (
    <div className="flex flex-row h-screen w-full bg-transparent vh100">
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userProfilePic={userData?.picture ?? null}
        userName={userData?.first_name ?? null}
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
