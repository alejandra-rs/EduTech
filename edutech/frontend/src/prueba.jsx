import { useState } from 'react';
import Layout from './components/Layout'
import Comentario from './components/Comentario'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Layout>
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-700 text-lg text-center mt-10 mb-8">
          ¡Genial! Tu estructura de componentes ya está funcionando con un Layout maestro.
        </p>
        <Comentario />
      </div>
    </Layout>
    </div>
  )
}