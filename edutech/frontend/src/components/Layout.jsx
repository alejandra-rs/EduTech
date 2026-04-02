Layout.jsx
import { useState } from 'react';
import Header from './Header';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} userProfilePic={null} userName={null} />
      <main className={`flex-1 p-8 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-24'}`}>
        {children}
      </main>
    </div>
  );
}