import { useState } from 'react';
import Layout from './components/Layout'
import Comentario from './components/Comentario'
import { PostCard } from './components/PostCard';
import PostGrid from './components/PostGrid.jsx'

export default function App() {
  return (
    <Layout>
    <div className="max-w-4xl mx-auto">
      <p className="text-gray-700 text-lg text-center mt-10 mb-8">
        ¡Genial! Tu estructura de componentes ya está funcionando con un Layout maestro.
      </p>
      <PostGrid posts={[
        { title: 'Curso de React', description: 'Aprende React desde cero', type: 'video', fileUrl: 'https://www.youtube.com/watch?v=iBOgARa-oak', date: '2024-01-01' },
        { title: 'Guía de JavaScript', description: 'Todo lo que necesitas saber sobre JS', type: 'pdf', fileUrl: 'D:\\Actividad 2.2. Algoritmos de planificación de CPU (ejercicio 1)_JMGF.pdf', date: '2024-02-15' },        { title: 'Curso de Tailwind CSS', description: 'Diseña con Tailwind CSS', type: 'video', fileUrl: 'https://www.youtube.com/watch?v=iBOgARa-oak', date: '2024-03-10' },
      ]} />
      <Comentario />
    </div>
  </Layout>
  )
}