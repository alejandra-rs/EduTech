import { useState, useEffect } from "react";
import {
  getDegrees,
  getUniversities,
  saveUserDegree,
  getDegreesByUserId,
} from "@services/degree";

export const UseDegreeSelection = (userId, usuarioAceptado) => {
  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState(null);
  const [degrees, setDegrees] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedDegreeIds, setSelectedDegreeIds] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);

        const userDegreeData = await getDegreesByUserId(userId);
        if (userDegreeData?.degree?.length > 0) {
          setSelectedDegreeIds(userDegreeData.degree);
        }
      } catch (error) {
        console.error("Error al obtener datos iniciales:", error);
      }
    };
    fetchInitialData();
  }, [userId]);

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

  const handleSelectUniversity = (uni) => {
    setSelectedUniversity(uni);
    setTimeout(() => setStep(2), 300);
  };

  const toggleDegreeSelection = (degree) => {
    setSelectedDegreeIds((prev) =>
      prev.includes(degree.id)
        ? prev.filter((id) => id !== degree.id)
        : [...prev, degree.id],
    );
  };

  const handleSaveDegrees = async () => {
    try {
      await saveUserDegree(userId, selectedDegreeIds);
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
