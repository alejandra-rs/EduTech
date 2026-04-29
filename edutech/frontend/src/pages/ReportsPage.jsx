import React from 'react';
import { ReportWidget } from '../components/ReportWidget';

const MOCK_REPORTS = [
  {
    id: 1,
    title: "Resumen de Mitosis",
    subject: "Biología Celular",
    type: "PDF",
    reasons: [
      { user: "Juan Pérez", date: "hace 2 días", reason: "El archivo está corrupto y no se puede abrir en dispositivos móviles." },
      { user: "Maria G.", date: "hace 1 día", reason: "Contenido desactualizado. Las fases de la meiosis están mezcladas con la mitosis y esto genera mucha confusión a los estudiantes de primer año. Además, el texto es extremadamente largo y tedioso de leer en este formato." }
    ]
  },
  {
    id: 2,
    title: "Cuestionario de Integrales",
    subject: "Cálculo I",
    type: "QUI",
    reasons: [
      { user: "Admin_21", date: "hace 5 horas", reason: "La pregunta 4 no tiene una respuesta correcta entre las opciones." }
    ]
  }
];

export default function ReportsPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
            Panel de Reportes
          </h1>
          <p className="text-gray-500">Gestiona las incidencias reportadas por la comunidad.</p>
        </header>

        <section className="space-y-4">
          {MOCK_REPORTS.length > 0 ? (
            MOCK_REPORTS.map(report => (
              <ReportWidget key={report.id} report={report} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No hay reportes pendientes ✨</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
