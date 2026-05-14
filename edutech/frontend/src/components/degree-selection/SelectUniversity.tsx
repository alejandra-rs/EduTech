import { UseDegreeSelection } from "./UseDegreeSelection";
import SelectionGrid from "./SelectionGrid";
import { ButtonControl } from "./ButtonControl";
import type { University, Degree } from "../../models/courses/course.model";

export interface SelectUniversityProps {
  userId: number,
  title: string;
  usuarioAceptado: () => void,
}

export default function SelectUniversity({ userId, title, usuarioAceptado }: SelectUniversityProps) {
  const {
    step,
    universities,
    degrees,
    selectedDegreeIds,
    handleSelectUniversity,
    toggleDegreeSelection,
    handleSaveDegrees,
    handleGoBack,
    isSaveDisabled,
  } = UseDegreeSelection(userId, usuarioAceptado);

  const highlightUniversities = step === 2 ? selectedDegreeIds : [];

  return (
    <div className="text-center w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>

      <div className="text-gray-600 mb-8">
        <SelectionGrid
          data={step === 1 ? universities : degrees}
          action={(i) => step === 1 ? handleSelectUniversity(i as University) : toggleDegreeSelection(i as Degree)}
          selectedIds={highlightUniversities}
        />
      </div>

      {step === 2 && (
        <ButtonControl
          handleGoBack={handleGoBack}
          handleSaveDegrees={handleSaveDegrees}
          isSaveDisabled={isSaveDisabled}
        />
      )}
    </div>
  );
}
