import { NavLink } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import HamburgerButton from "./HamburgerButton";
import {
  ArrowRightStartOnRectangleIcon,
  PencilSquareIcon,
  BellIcon,
  RectangleStackIcon,
  DocumentIcon,
  AcademicCapIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export default function Header({ isOpen, setIsOpen, userProfilePic, userName, instance, accountsMsal, isAdmin }) {
  
  const handleLogoutRedirect = () => {
    instance.logoutRedirect({ account: accountsMsal[0] }).catch(console.error);
  };

  const navLinks = [
    { to: "/suscripciones/", label: "Mis asignaturas", icon: BellIcon },
    { to: "/borradores/", label: "Mis borradores", icon: PencilSquareIcon },
    { to: "/mis-publicaciones/", label: "Mi material", icon: DocumentIcon },
    { to: "/degrees/", label: "Cambiar carrera", icon: AcademicCapIcon },
  ];

  const baseItemClass = `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
    isOpen ? "w-full" : "w-12 justify-center"
  }`;
  
  const getLinkClass = ({ isActive }) => 
    `${baseItemClass} ${isActive ? "text-white border border-white bg-blue-900" : "text-white hover:bg-white-10"}`;

  return (
    <aside className={`h-screen bg-slate-900 flex flex-col py-8 shadow-2xl transition-all duration-500 ${isOpen ? "w-64 px-4" : "w-20 px-4"}`}>
      
      <NavLink key="/" to="/" className={`flex items-center gap-3 mb-10 text-white font-bold text-xl px-2 ${!isOpen && "justify-center"}`}>
        <RectangleStackIcon className="w-10 h-10 shrink-0" />
        {isOpen && <span>Edutech</span>}
      </NavLink>

      <div className={`flex items-center mb-10 p-2 rounded-2xl ${isOpen ? "bg-white/5 border border-white/10 gap-4" : "justify-center"}`}>
        <div className="scale-75 relative shrink-0">
          <UserAvatar imageUrl={userProfilePic} />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
        </div>
        {isOpen && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{userName || 'Usuario'}</p>
            <p className={`text-xs font-semibold italic text-${isAdmin ? "red-400" : "gray-400"}`}>
              {isAdmin ? "Admin" : "Estudiante"}
            </p>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={getLinkClass} title={label}>
            <Icon className="w-6 h-6 shrink-0" />
            {isOpen && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
          </NavLink> 
        ))}


        {isAdmin && (
          <>
            <hr className="m-2"></hr>
            <NavLink to="/reports" className={getLinkClass}>
              <ShieldExclamationIcon className="w-6 h-6 shrink-0 text-red-400" />
              {isOpen && <span className="text-sm font-medium text-red-400">Reportes</span>}
            </NavLink>
          </>
        )}

        {isOpen && (
          <button onClick={handleLogoutRedirect} className={`${baseItemClass} text-red-400 hover:bg-red-500/10 mt-auto`}>
            <ArrowRightStartOnRectangleIcon className="w-6 h-6 shrink-0" />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        )}
      </nav>

      <div className="pt-4 flex justify-center border-t border-white/5">
        <div className="hover:bg-white/5 p-1.5 rounded-full cursor-pointer scale-75">
          <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </div>
      </div>
    </aside>
  );
}