export function TitlePage({ PageName, onBack, backLabel = "Volver", children }) {
  return (
    <div className="relative px-12 pt-10 pb-4 shrink-0 flex items-center min-h-[100px]">
      <div onClick={onBack} className="group flex items-center gap-2 cursor-pointer z-20">
        <span className="text-2xl font-light text-gray-400 group-hover:text-black group-hover:-translate-x-1 transition-all duration-200">
          {"<"}
        </span>
        <span className="text-sm font-medium text-gray-400 group-hover:text-black transition-colors uppercase tracking-wider">
          {backLabel}
        </span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-[60%]">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {PageName}
        </h1>
        <div className="h-1 w-12 bg-indigo-500 rounded-full mt-1"></div>
      </div>

      <div className="ml-auto flex items-center gap-4 z-20">
        {children}
      </div>
    </div>
  );
}