import React from 'react';
import { ReportWidget } from '../components/ReportWidget';

const MOCK_REPORTS = [
  {
    id: 1,
    title: "Resumen del primer parcial de Fundamentos de Programación I",
    subject: "Fundamentos de Programación I",
    type: "PDF",
    reasons: [
      { 
        type: "Contenido desactualizado", 
        comment: "Los apuntes de programación están mezclados con el contenido de POO y genera mucha confusión. Sería ideal tenerlos separados por curso o al menos una sección clara para cada uno. Además, algunos ejemplos de código ya no funcionan con las versiones actuales de los lenguajes.", 
        date: "Hace 1 día" 
      },
      { 
        type: "Archivo corrupto", 
        comment: "",
        date: "Hace 2 días" 
      },
      { 
        type: "Contenido desactualizado", 
        comment: "Los apuntes de programación están mezclados con el contenido de POO y genera mucha confusión. Sería ideal tenerlos separados por curso o al menos una sección clara para cada uno. Además, algunos ejemplos de código ya no funcionan con las versiones actuales de los lenguajes.", 
        date: "Hace 1 día" 
      },
      { 
        type: "Archivo corrupto", 
        comment: "",
        date: "Hace 2 días" 
      },
      { 
        type: "Contenido desactualizado", 
        comment: "Los apuntes de programación están mezclados con el contenido de POO y genera mucha confusión. Sería ideal tenerlos separados por curso o al menos una sección clara para cada uno. Además, algunos ejemplos de código ya no funcionan con las versiones actuales de los lenguajes.", 
        date: "Hace 1 día" 
      },
      { 
        type: "Archivo corrupto", 
        comment: "",
        date: "Hace 2 días" 
      },
      { 
        type: "Contenido desactualizado", 
        comment: "Los apuntes de programación están mezclados con el contenido de POO y genera mucha confusión. Sería ideal tenerlos separados por curso o al menos una sección clara para cada uno. Además, algunos ejemplos de código ya no funcionan con las versiones actuales de los lenguajes.", 
        date: "Hace 1 día" 
      },
      { 
        type: "Archivo corrupto", 
        comment: "",
        date: "Hace 2 días" 
      }
    ]
  },
  {
    id: 2,
    title: "Resumen del primer parcial de Fundamentos de Programación I",
    subject: "Fundamentos de Programación I",
    type: "VID",
    reasons: [
      { 
        type: "Contenido desactualizado", 
        comment: "Los apuntes de programación están mezclados con el contenido de POO y genera mucha confusión. Sería ideal tenerlos separados por curso o al menos una sección clara para cada uno. Además, algunos ejemplos de código ya no funcionan con las versiones actuales de los lenguajes.", 
        date: "Hace 1 día" 
      },
      { 
        type: "Archivo corrupto", 
        comment: "",
        date: "Hace 2 días" 
      }
    ]
  },
  {
    id: 3,
    title: "Resumen del primer parcial de Fundamentos de Programación I",
    subject: "Fundamentos de Programación I",
    type: "FLC",
    reasons: [
      { 
        type: "Contenido desactualizado", 
        comment: "Los apuntes de programación están mezclados con el contenido de POO y genera mucha confusión. Sería ideal tenerlos separados por curso o al menos una sección clara para cada uno. Además, algunos ejemplos de código ya no funcionan con las versiones actuales de los lenguajes.", 
        date: "Hace 1 día" 
      },
      { 
        type: "Archivo corrupto", 
        comment: "",
        date: "Hace 2 días" 
      }
    ]
  },
  {
    id: 4,
    title: "Cuestionario de Integrales",
    subject: "Cálculo I",
    type: "QUI",
    reasons: [
      { 
        type: "Error en las respuestas", 
        comment: "La pregunta 4 no tiene una respuesta correcta entre las opciones.", 
        date: "Hace 5 horas" 
      }
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
