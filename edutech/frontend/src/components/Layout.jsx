import { useState } from 'react';
import Header from './Header';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} userProfilePic={null} userName={null} />
      
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}