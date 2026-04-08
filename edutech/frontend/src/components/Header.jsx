import UserAvatar from "./UserAvatar";
import HamburgerButton from "./HamburgerButton";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Header({
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
  return (
    <aside
      className={`select-none header h-screen bg-gray-400 flex flex-col py-10 shadow-lg shrink-0
                  transition-all duration-300 ease-in-out 
                  ${isOpen ? "w-64 px-5 items-start" : "w-24 px-0 items-center"}`}
    >
      <div
        className={`flex flex-col items-center w-full mb-10 transition-all ${isOpen ? "gap-3 justify-start" : "justify-center"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-sm shadow-sm flex items-center justify-center flex-shrink-0"></div>
          <h1
            className={`text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
          >
            Edutech
          </h1>
        </div>
        <div className={`flex flex-col items-center mt-4`}>
          <UserAvatar imageUrl={userProfilePic} />
          <h2 className={`text-white text-sm mt-2 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>    
            {userName || 'User'}
          </h2>
        </div>
      </div>
      

      <nav
        className={`flex flex-col space-y-4 w-full overflow-hidden transition-all duration-300 
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <a
          href="#"
          className="flex gap-3 text-white hover:text-blue-200 font-medium text-lg px-2 py-1 hover:bg-white/10 rounded transition-colors"
        >
          📚 <span>Cursos</span>
        </a>
        <a
          href="#"
          className="flex gap-3 text-white hover:text-blue-200 font-medium text-lg px-2 py-1 hover:bg-white/10 rounded transition-colors"
        >
          📄 <span>Documentos</span>
        </a>
        <a
          className="flex items-center gap-3 text-white hover:text-blue-200 font-medium text-lg px-2 py-1 hover:bg-white/10 rounded transition-colors"
          onClick={handleLogoutRedirect}
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5 " />
          <span>Salir</span>
        </a>
      </nav>

      <div className="mt-auto w-full flex justify-center">
        <HamburgerButton 
          isOpen={isOpen} 
          onClick={() => setIsOpen(!isOpen)} 
          className={`${isOpen ? 'self-end' : ''}`} 
        /> 
      </div>
    </aside>
  );
}
