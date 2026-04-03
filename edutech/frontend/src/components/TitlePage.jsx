export function TitlePage({ PageName, onBack, children }) {
  return (
    <div className="px-12 pt-10 shrink-0 flex">
      <div
        onClick={onBack}
        className="flex-1 group flex items-center gap-4 cursor-pointer w-fit"
      >
        <span className="text-4xl font-light group-hover:scale-125 group-hover:-translate-x-1 transition-all duration-200 text-gray-600">
          {"<"}
        </span>
        <h1 className="text-5xl font-bold text-gray-800 group-hover:text-black transition-colors group-hover:scale-105 group-hover:-translate-x-1 duration-300">
          {PageName}
        </h1>
      </div>
      <div className=" flex gap-4">{children}</div>
    </div>
  );
}
