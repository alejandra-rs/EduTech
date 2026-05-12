import SelectUniversity from "../components/degree-selection/SelectUniversity";
import { Student } from "../models/student/student.model";

export interface ChangeDegreeProps {
  userData: Student | null;
}

export default function ChangeDegree({userData}: ChangeDegreeProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex-grow overflow-y-auto custom-scrollbar px-8 pt-12 pb-10 text-center w-full max-w-2xl">
        <SelectUniversity
          userId={Number(userData?.id)}
          title="Selecciona o añade una carrera nueva."
          usuarioAceptado={() => { window.location.href = "/"; }}
        />
        <p className="text-sm text-gray-500 mt-6">
          Si deseas quitarte la carrera actual, debes dirigirte a la universidad y desmarcar la carrera que ya no deseas tener.
        </p>
      </div>
    </div>
  );
}
