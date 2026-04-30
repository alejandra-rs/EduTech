import { useEffect, useState } from "react";
import {
  getDegrees,
  getUniversities,
  saveUserDegree,
} from "../services/degree";
import SelectionGrid from "../components/SelectionGrid";

export default function SelectUniversity({ userId, usuarioAceptado }) {
  const [paso, setPaso] = useState(1);
  const [universitySelected, setUniversitySelected] = useState(null);
  const [degrees, setDegrees] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedDegreesIds, setSelectedDegreesIds] = useState([]);
  useEffect(() => {
    getUniversities()
      .then((data) => {
        console.log("Universidades obtenidas:", data);
        setUniversities(data);
      })
      .catch((error) => {
        console.error("Error al obtener universidades:", error);
      });
  }, []);

  useEffect(() => {
    if (universitySelected) {
      getDegrees(universitySelected.id)
        .then((data) => {
          console.log(
            "Carreras obtenidas para universidad",
            universitySelected.name,
            ":",
            data,
          );
          setDegrees(data);
        })
        .catch((error) => {
          console.error("Error al obtener carreras:", error);
        });
    }
  }, [universitySelected]);

  const chooseUniversity = (uni) => {
    setUniversitySelected(uni);
    setPaso(2);
  };
  const toogleDegreeSelection = (degree) => {
    setSelectedDegreesIds((prev) =>
      prev.includes(degree.id)
        ? prev.filter((id) => id !== degree.id)
        : [...prev, degree.id],
    );
  };

  const chooseDegree = async (degree) => {
    await saveUserDegree(userId, degree);
    if (usuarioAceptado) {
      usuarioAceptado();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg text-center w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Elige la {paso === 1 ? "Universidad" : "Carrera"} que estás estudiando
        </h2>
        <SelectionGrid
          data={paso === 1 ? universities : degrees}
          action={paso === 1 ? chooseUniversity : toogleDegreeSelection}
          selectedIds={
            paso === 1 ? [universitySelected?.id] : selectedDegreesIds
          }
        />
        {paso === 2 && (
          <button
            onClick={() => chooseDegree(selectedDegreesIds)}
            disabled={selectedDegreesIds.length === 0}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full transition-colors disabled:bg-gray-400"
          >
            Guardar y continuar
          </button>
        )}
      </div>
    </div>
  );
}
