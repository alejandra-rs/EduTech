Layout.jsx
import { useState } from 'react';
import Header from './Header';

// La propiedad { children } representa todo lo que pongas DENTRO de las etiquetas <Layout> ... </Layout>
export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* El Header siempre estará aquí, manejando su propio estado de abierto/cerrado */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} userProfilePic={null} userName={null} />
      
      {/* El main ajusta su margen automáticamente, y luego imprime lo que sea que le pasemos */}
      <main className={`flex-1 p-8 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-24'}`}>
        {children}
      </main>
    </div>
  );
}