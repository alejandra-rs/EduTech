import React from 'react';

const SearchBar = ({ placeholder = "Search...", color = "bg-blue-600" }) => {
  return (
    <form className="max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>   
      <label htmlFor="search" className="sr-only">Search</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
          </svg>
        </div>

        <input 
          type="search" 
          id="search" 
          className="block w-full p-4 ps-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder:text-gray-400 outline-none transition-all" 
          placeholder={placeholder} 
          required 
        />

        <button 
          type="submit" 
          className={`
            absolute end-2 top-1/2 -translate-y-1/2 
            text-white ${color} 
            font-medium rounded-lg text-xs px-4 py-2 
            transition-all duration-200 ease-in-out
            hover:scale-105 hover:opacity-95
            active:scale-90
            focus:ring-4 focus:outline-none
          `}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;