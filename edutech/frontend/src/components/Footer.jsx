import { useNavigate, useLocation } from "react-router-dom";

const NotebookFooter = ({ tabs = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tabs.findIndex((tab) =>
    location.pathname.endsWith(tab.path),
  );

  const handleTabClick = (tab) => {
    if (location.pathname.includes("/upload")) {
      const pathParts = location.pathname.split("/");
      const uploadIndex = pathParts.indexOf("upload");
      if (uploadIndex !== -1) {
        tab.path = [...pathParts.slice(0, uploadIndex + 1), tab.path].join("/");
      }
    }
    navigate(tab.path);
  };

  return (
    <footer className="w-full font-mono pointer-events-none group z-10 relative">
      {/* Contenedor de pestañas */}
      <div className="flex ml-8 space-x-1 items-end h-10 bg-transparent overflow-visible transition-transform duration-300 translate-y-[2px] group-hover:translate-y-0">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab)}
            className={`
              px-4 transition-all duration-300 ease-out pointer-events-auto
              rounded-t-lg text-white font-bold text-[10px] uppercase tracking-tighter
              ${tab.color}
              ${activeTab === index 
                ? "h-10 pb-2 shadow-md" 
                : "h-7 pb-1 hover:h-9 opacity-80 hover:opacity-100"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* La "Hoja" de cuaderno */}
      <div 
        className={`
          bg-white relative shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
          pointer-events-auto transition-all duration-500 ease-in-out
          h-1 group-hover:h-12 translate-y-0
        `}
      >
        {/* Líneas de cuaderno (solo 2 líneas visibles al expandirse) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "100% 1.5rem", // 1.5rem * 2 líneas = 3rem (48px)
            backgroundPosition: "0 1.4rem"
          }}
        ></div>
        
        {/* Margen rojo vertical */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-red-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      </div>
    </footer>
  );
};

export default NotebookFooter;