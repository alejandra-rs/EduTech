import SelectUniversity from "../components/degree-selection/SelectUniversity";

export default function SelectDegree() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg text-center w-full max-w-2xl">
        <SelectUniversity
          title="Elige tu carrera"
          usuarioAceptado={() => {
            window.location.href = "/";
          }}
        />
      </div>
    </div>
  );
}
