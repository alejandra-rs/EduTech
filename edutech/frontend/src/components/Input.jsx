export default function Input({
  label, placeholder = "Value", rows = 1, value, onChange, 
  type = "text", required = false, className, id,
}) {
  const baseStyle =
    "w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all bg-white text-gray-800";
  const fileStyle =
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer";
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={`${baseStyle} resize-none`}
        ></textarea>
      ) : (
        <input
          id={id}
          type={type}
          value={type === "file" ? undefined : value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={className ?? (type === "file" ? fileStyle : baseStyle)}
        />
      )}
    </div>
  );
}
