import { Degree, University } from "../../models/courses/course.model";

export interface SelectionGridProps {
  data: University[] | Degree[] | null,
  action: (i: University | Degree) => void;
  selectedIds?: number[]
}

export default function SelectionGrid({ data = [], action, selectedIds = [] }: SelectionGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data?.map((i: University | Degree) => {
        const isSelected = selectedIds.includes(i.id);
        return (
          <button
            key={i.id}
            onClick={() => action(i)}
            className={`flex items-center justify-center gap-3 p-4 rounded-full font-bold text-base transition-all duration-200 border-2
              ${
                isSelected
                  ? "bg-blue-100 border-blue-500 text-blue-800 shadow-md"
                  : "bg-gray-200 border-transparent hover:bg-gray-300 text-gray-800"
              }
            `}
          >
            {i.name}
            {isSelected && <span className="ml-2 text-blue-500">✓</span>}
            {"logo" in i && i.logo && (
              <img
                className="w-10 h-10 object-contain rounded-full"
                src={i.logo}
                alt={i.name}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
