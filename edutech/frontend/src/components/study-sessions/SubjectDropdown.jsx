import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const SubjectDropdown = ({ label, value, onChange, subjects = [], placeholder, multiple = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const norm = (str) => (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const currentValues = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

  const divulgativaOption = { id: "divulgativa", name: "Divulgativa", title: "Divulgativa" };
  const allSubjects = [divulgativaOption, ...subjects];

  const sortedFiltered = [...allSubjects]
    .sort((a, b) => {
      if (a.id === "divulgativa") return -1;
      if (b.id === "divulgativa") return 1;
      return currentValues.includes(b.id) - currentValues.includes(a.id);
    })
    .filter(s => norm(s.name || s.title).includes(norm(search)));

  const handleToggle = (id) => {
    if (!multiple) {
      onChange(value === id ? "" : id);
      setOpen(false);
    } else {
      onChange(currentValues.includes(id) ? currentValues.filter(v => v !== id) : [...currentValues, id]);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(multiple ? [] : "");
  };

  const getDisplayText = () => {
    if (open) return search;
    if (multiple) {
      return currentValues.map(id => allSubjects.find(s => s.id === id)?.name || id).filter(Boolean).join(", ");
    } else {
      const selected = allSubjects.find(s => s.id === value);
      return selected?.name || "";
    }
  };

  return (
    <div className="w-full relative">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      
      <div className="relative">
        <input
          value={getDisplayText()}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => { setOpen(true); setSearch(""); }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg p-3 pr-10 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all bg-white text-gray-800"
        />
        
        {((!multiple && value) || (multiple && currentValues.length > 0)) && (
          <button
            onMouseDown={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            type="button"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {sortedFiltered.map((s) => {
            const isSelected = currentValues.includes(s.id);
            const isDivulgativa = s.id === "divulgativa";
            return (
              <div 
                key={s.id}
                onMouseDown={(e) => { e.preventDefault(); handleToggle(s.id); }}
                className={`flex items-center justify-between px-4 py-2 hover:bg-zinc-50 cursor-pointer group transition-colors ${isSelected ? "bg-zinc-50" : ""} ${isDivulgativa ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {multiple && <input type="checkbox" checked={isSelected} readOnly className="accent-zinc-600 h-4 w-4" />}
                  <span className={`${isSelected ? "font-bold text-zinc-900" : "text-gray-800"} ${isDivulgativa ? "italic text-gray-500" : ""}`}>
                    {s.name || s.title}
                  </span>
                </div>
              </div>
            );
          })}
          {sortedFiltered.length === 0 && <p className="px-4 py-2 text-sm text-gray-400">Sin resultados</p>}
        </div>
      )}
    </div>
  );
};