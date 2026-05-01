export const ButtonControl = ({
  handleGoBack,
  handleSaveDegrees,
  isSaveDisabled,
}) => (
  <div className="mt-8">
    {isSaveDisabled && (
      <p className="text-red-500 text-sm font-medium mb-4">
        * Debes seleccionar al menos una carrera para poder continuar.
      </p>
    )}
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      <button
        onClick={handleGoBack}
        className="w-full sm:w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-3 rounded-full transition-colors"
      >
        Volver
      </button>
      <button
        onClick={handleSaveDegrees}
        disabled={isSaveDisabled}
        className="w-full sm:w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Guardar y continuar
      </button>
    </div>
  </div>
);
