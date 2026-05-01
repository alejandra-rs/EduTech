import UserAvatar from "./UserAvatar";
import HamburgerButton from "./HamburgerButton";
import { 
  ArrowRightStartOnRectangleIcon, 
  PencilSquareIcon, 
  BellIcon,
  RectangleStackIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom"

export default function Header ({
  isOpen,
  setIsOpen,
  userProfilePic,
  userName,
  instance,
  accountsMsal,
}) {
  const handleLogoutRedirect = () => {
    instance
      .logoutRedirect({
        account: accountsMsal[0],
      })
      .catch((error) => console.log(error));
  };

  
  const navLinks = [
  { to: "/suscripciones/", label: "Mis asignaturas", icon: BellIcon, title: "Cursos" },
  { to: "/borradores/", label: "Mis borradores", icon: PencilSquareIcon, title: "Documentos" },
  { to: "/mis-publicaciones/", label: "Mi material", icon: DocumentIcon, title: "Material" },
  ];
  const navItemClass = `
    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
    ${isOpen ? "w-full" : "w-12 justify-center"}
    hover:bg-white/10 hover:shadow-lg active:scale-95
  `;

  const getLinkClass = ({ isActive }) => 
    `${navItemClass} ${isActive ? "bg-white/20 shadow-inner border border-white/10" : "text-white"}`;

  return (
    <aside
      className={`select-none h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col py-8 shadow-2xl shrink-0
                  transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-50
                  ${isOpen ? "w-64 px-4" : "w-20 px-4"}`}
    >
      <div className={`flex items-center mb-10 overflow-hidden ${isOpen ? "px-2" : "justify-center"}`}>
        <a href="/" className="d-flex text-white font-bold text-xl" title="Edutech">
          <RectangleStackIcon className="w-10 h-10 text-white group-hover:text-white transition-colors" />
          {isOpen && <span className="text-white font-medium text-xl">Edutech</span>}
        </a>
      </div>



      <div className={`mb-10 p-2 rounded-2xl transition-colors ${isOpen ? "bg-white/5 border border-white/10" : ""}`}>
        <div className={`flex items-center ${isOpen ? "gap-4" : "justify-center"}`}>
          <div className="scale-75 relative">
            <UserAvatar imageUrl={userProfilePic} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0">
              <p className="text-white font-bold text-sm truncate">{userName || 'Usuario'}</p>
              <p className="text-indigo-300 text-[10px] uppercase font-black tracking-widest">Estudiante</p>
            </div>
          )}
        </div>
      </div>

      <hr className="border-white-100"></hr>

      <nav className="flex flex-col gap-2 flex-1">

        {navLinks.map(({ to, label, icon: Icon, title }) => (
          <NavLink key={to} to={to} className={getLinkClass} title={title}>
            <Icon className="w-6 h-6 text-white group-hover:text-white transition-colors" />
            {isOpen && <span className="text-white font-medium text-sm">{label}</span>}
          </NavLink>
        ))}

        <hr className="border-white-100"></hr>

      { isOpen &&
        <button 
          onClick={handleLogoutRedirect} 
          className={`${navItemClass} text-red-400 hover:text-white hover:bg-red-500/20`}
          title="Salir"
        >
          <ArrowRightStartOnRectangleIcon className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium text-sm">Cerrar sesión</span>
        </button>
      }
      </nav>

      <div className="mt-auto pt-4 flex justify-center border-t border-white/5">
        <div className="hover:bg-white/5 p-1.5 rounded-full transition-colors cursor-pointer scale-75">
          <HamburgerButton 
            isOpen={isOpen} 
            onClick={() => setIsOpen(!isOpen)} 
          /> 
        </div>
      </div>
    </aside>
  );
}