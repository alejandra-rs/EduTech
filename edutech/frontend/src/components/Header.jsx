import { useState } from 'react';
import UserAvatar from './UserAvatar';
import HamburgerButton from './HamburgerButton';

export default function Header({ userProfilePic, userName }) {
  
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    
    <aside 
      className={`select-none header h-screen bg-gray-400 flex flex-col py-10 fixed left-0 top-0 shadow-lg 
                  transition-all duration-300 ease-in-out 
                  ${isOpen ? 'w-64 px-5 items-start' : 'w-24 px-0 items-center'}`}
    >

     <div className={`flex flex-col items-center w-full mb-10 transition-all ${isOpen ? 'gap-3 justify-start' : 'justify-center'}`}>
      <div className={`flex items-center gap-3 transition-opacity duration-300 'opacity-100' : `}>
        <div className="w-12 h-12 bg-white rounded-sm shadow-sm flex items-center justify-center flex-shrink-0">
        </div>
        <h1 className={`text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          Edutech
        </h1>
      </div>
      <UserAvatar imageUrl={userProfilePic} />
      <h2 className={`text-white text-sm mt-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
        {userName || 'User'}
      </h2>
    </div>
      <HamburgerButton 
        isOpen={isOpen} 
        onClick={() => setIsOpen(!isOpen)} 
        className={`mb-6 ${isOpen ? 'self-end' : ''}`} 
      /> 

      <nav className={`flex flex-col space-y-4 w-full overflow-hidden transition-all duration-300 
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <a href="#" className="flex gap-3 text-white hover:text-blue-200 font-medium text-lg px-2 py-1 hover:bg-white/10 rounded transition-colors">
            📚 <span select-none className={`${isOpen ? '' : 'hidden'}`}>Cursos</span>
          </a>
          <a href="#" className="flex gap-3 text-white hover:text-blue-200 font-medium text-lg px-2 py-1 hover:bg-white/10 rounded transition-colors">
            📄 <span select-none className={`${isOpen ? '' : 'hidden'}`}>Documentos</span>
          </a>
      </nav>

    </aside>
  );
}