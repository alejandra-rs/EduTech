export default function Comentario() {
  return (
    <div className="bg-[#dfdfdf] rounded-lg p-5 sm:p-6 flex gap-4 w-full font-sans">
      
      <img 
        src="https://i.pravatar.cc/150?img=47" 
        alt="Avatar del usuario" 
        className="w-12 h-12 rounded-full object-cover shrink-0"
      />
      
      <div className="flex-1 flex flex-col">
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Name Surname
        </h3>
        
        <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        
        <div className="flex justify-end items-center gap-5 mt-auto">
          
          <button className="flex items-center gap-2 text-gray-900 hover:opacity-70 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span className="font-bold text-lg">100</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-900 hover:opacity-70 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
            </svg>
            <span className="font-bold text-lg">50</span>
          </button>
          
          <button className="text-gray-900 hover:opacity-70 transition-opacity ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="7" x2="21" y2="7"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="17" x2="21" y2="17"></line>
            </svg>
          </button>
          
        </div>
      </div>
    </div>
  );
}