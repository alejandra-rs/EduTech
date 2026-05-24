import { useState, useEffect } from "react";
import {
  getDegrees,
  getUniversities,
  saveUserDegree,
  getMyDegrees,
} from "../../services/connections-degrees";
import type { University, Degree } from "../../models/courses/course.model";

export const UseDegreeSelection = (usuarioAceptado?: () => void) => {
  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState<University[] | null>(null);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedDegreeIds, setSelectedDegreeIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);

        const userDegreeData = await getMyDegrees();
        if (userDegreeData?.degree && userDegreeData.degree.length > 0) {
          setSelectedDegreeIds(userDegreeData.degree);
        }
      } catch (error) {
        console.error("Error al obtener datos iniciales:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedUniversity) return;
    const fetchDegrees = async () => {
      try {
        const data = await getDegrees(selectedUniversity.id);
        setDegrees(data);
      } catch (error) {
        console.error("Error al obtener carreras:", error);
      }
    };
    fetchDegrees();
  }, [selectedUniversity]);

  const handleSelectUniversity = (uni: University) => {
    setSelectedUniversity(uni);
    setTimeout(() => setStep(2), 300);
  };

  const toggleDegreeSelection = (degree: Degree) => {
    setSelectedDegreeIds((prev) =>
      prev.includes(degree.id)
        ? prev.filter((id) => id !== degree.id)
        : [...prev, degree.id],
    );
  };

  const handleSaveDegrees = async () => {
    try {
      await saveUserDegree(selectedDegreeIds);
      if (usuarioAceptado) usuarioAceptado();
    } catch (error) {
      console.error("Error al guardar la carrera:", error);
    }
  };

  const handleGoBack = () => {
    setStep(1);
    setSelectedUniversity(null);
  };

  return {
    step,
    universities,
    degrees,
    selectedDegreeIds,
    handleSelectUniversity,
    toggleDegreeSelection,
    handleSaveDegrees,
    handleGoBack,
    isSaveDisabled: selectedDegreeIds.length === 0,
  };
};
