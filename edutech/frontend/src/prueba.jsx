import Input from './components/input';

export default function Prueba() {
  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center gap-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm space-y-8">
        {/* Ejemplo 1: Subida de Archivos */}
        <Input 
          label="Sube tu documento PDF" 
          type="file" 
        />
        {/* Ejemplo 2: Título (Input normal) */}
        <Input 
          label="Título de la publicación" 
          placeholder="Ej: Apuntes Tema 1" 
        />
        {/* Ejemplo 3: Descripción (Textarea) */}
        <Input 
          label="Descripción detallada" 
          placeholder="Escribe aquí los detalles..." 
          rows={4} 
        />
      </div>
    </div>
  );
}