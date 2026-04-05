# EduTech – Plataforma Académica

## Sprint 0 – Fundamentos del Proyecto

Este sprint inicial tiene como objetivo construir una **primera versión funcional (MVP)** de EduTech, sentando las bases del sistema tanto a nivel técnico como de producto.

EduTech nace para resolver un problema claro: la **dispersión del contenido académico**. La plataforma permite a los estudiantes centralizar apuntes, compartir recursos y colaborar de forma estructurada.

---

## Objetivo del Sprint

El objetivo principal del Sprint 0 es disponer de una aplicación que permita:

- Navegar por cursos y asignaturas  
- Subir y visualizar contenido (PDF y vídeos)  
- Interactuar con los recursos (valoración, contenido, suscripciones)  

En otras palabras, entregar una primera versión usable que aporte valor real desde el inicio.

---

## Historias de Usuario Implementadas

Durante este sprint se han desarrollado las siguientes historias de usuario del backlog:

- **HU-000:** Inicio de sesión  
- **HU-100:** Subida de Documentos a Asignaturas  
- **HU-101:** Visualización de Material de Asignatura  
- **HU-102:** Navegación Organizada por Cursos  
- **HU-109:** Publicación de vídeos  
- **HU-110:** Descarga de contenido para uso offline 
- **HU-112:** Búsqueda de documentos por título  
- **HU-116:** Filtrado de Material por Asignatura  
- **HU-118:** Sistema de comentarios  
- **HU-119:** Visualización de comentarios  
- **HU-120 / HU-121:** Valoración de contenido  
- **HU-122:** Contadores de valoración  
- **HU-103 / HU-104 / HU-105:** Sistema de suscripciones  

Estas historias constituyen el núcleo del MVP del sistema.

---

## Funcionalidades incluidas

Durante este sprint se han implementado las siguientes capacidades:

### Gestión de contenido
- Subida de documentos PDF
- Publicación de vídeos (YouTube)
- Visualización y descarga de materiales
- Búsqueda por título

### Navegación
- Organización por cursos y asignaturas
- Filtrado de contenido

### Interacción
- Valoración de documentos y vídeos (likes / dislikes)
- Contadores de visualización

### Suscripciones
- Suscripción a asignaturas

---

## Valor aportado al usuario

Este sprint proporciona una primera solución funcional que permite:

- Centralizar contenido académico en un único lugar  
- Acceder rápidamente a materiales organizados por asignatura  
- Evaluar la calidad de los recursos mediante valoraciones  
- Interactuar con otros estudiantes mediante comentarios  
- Mantenerse actualizado mediante suscripciones  

Con esto, el usuario pasa de tener información dispersa a disponer de un entorno estructurado y colaborativo.

---

## Estructura del Proyecto

### Estructura de Carpetas
```text
edutech/
├── frontend/                # Aplicación React (Vite)
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Vistas principales
│   │   ├── services/        # Lógica de API
│   │   └── Main.jsx         
│   └── package.json         # Dependencias
├── backend/                 # Lógica de servidor (Django)
└── tests/
    └── frontend/            # Mock server (db.json)
```

- Componentes ([/components](./edutech/frontend/src/components)): [Componentes.md](./doc/Componentes.md).

- Páginas ([/pages](./edutech/frontend/src/pages)): [Pages.md](./doc/Pages.md).

- Servicios ([/services](./edutech/frontend/src/services)): [Services.md](./doc/Services.md).

---

## Próximos pasos

En el siguiente sprint se abordarán funcionalidades más avanzadas:

- Integración de un chatbot basado en IA  
- Generación automática de cuestionarios y flashcards  
- Sistema de reporte de contenido  
- Mejora del sistema de autenticación  

El objetivo será evolucionar el MVP hacia una plataforma más inteligente y personalizada.

## Tech Tag

- **Frontend:** React + Vite  
- **Estilos:** Tailwind CSS + Flowbite  
- **Backend (prototipo):** JSON Server  
- **Backend (objetivo):** Django  
- **Base de datos:** PostgreSQL + pgvector  
- **Control de versiones:** Git & GitHub  

---

## Ejecución del proyecto

```bash
# Clonar repositorio
cd edutech/frontend/

# Instalar dependencias
npm install
npm install react-router-dom react react-dom

# Ejecutar frontend
npm run dev

# (Opcional) Backend mock
cd edutech/tests/frontend/
npx json-server@0.17.4 --watch db.json --routes routes.json --port 8000
```
---

## Equipo (D-MACH)
* José Marcial Galván Franco
* Houyame Liazidi Daoudi
* Alejandra Rodríguez Silva
* Cristina Santana Martin
* Dácil Santana Ortega