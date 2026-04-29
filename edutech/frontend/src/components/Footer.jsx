import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationGuard } from "../context/NavigationGuardContext";

const Footer = ({ tabs = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { guardedNavigate } = useNavigationGuard();

  const activeTab = tabs.findIndex((tab) => location.pathname.endsWith(tab.path) || location.pathname === tab.path);

  const handleTabClick = (tab) => {
    const doNavigate = () => {
      if (tab.path.startsWith("/")) return navigate(tab.path);
      if (location.pathname.includes("/upload")) {
        const pathParts = location.pathname.split("/");
        const uploadIndex = pathParts.indexOf("upload");
        if (uploadIndex !== -1) {
          const newPath = [...pathParts.slice(0, uploadIndex + 1), tab.path].join("/");
          return navigate(newPath);
        }
      }
      navigate(tab.path);
    };
    guardedNavigate(doNavigate);
  };

  return (
    <footer className="w-full font-mono pointer-events-none group z-50 relative">
      <div className="flex ml-8 space-x-1 items-end h-12 bg-transparent overflow-visible transition-transform duration-300 translate-y-[2px] group-hover:translate-y-0">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab)}
            className={`
              px-6 transition-all duration-300 ease-out pointer-events-auto
              rounded-t-xl text-white font-black text-[13px] uppercase tracking-tighter
              ${tab.color} shadow-lg
              ${activeTab === index 
                ? "h-12 pb-3 z-20" 
                : "h-8 pb-1 hover:h-11 opacity-85 hover:opacity-100 z-10"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div 
        className={`
          bg-white relative shadow-[0_-10px_20px_rgba(0,0,0,0.05)]
          pointer-events-auto transition-all duration-500 ease-in-out
          h-2 group-hover:h-14 translate-y-0 border-t border-gray-100
        `}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "100% 1.2rem",
            backgroundPosition: "0 1rem"
          }}
        ></div>

        <div className="absolute left-10 top-0 bottom-0 w-[2px] bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      </div>
    </footer>
  );
};

export default Footer;