import { forwardRef, useRef, useEffect, useCallback } from "react";

const Input = forwardRef(function Input({
  label, placeholder = "Value", rows = 1, value, onChange,
  type = "text", required = false, className, id, autoResize = false,
}, forwardedRef) {
  const localRef = useRef(null);

  const setRef = useCallback((node) => {
    localRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);

  useEffect(() => {
    if (!autoResize || rows <= 1) return;
    const el = localRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, autoResize, rows]);

  const baseStyle =
    "w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all bg-white text-gray-800";
  const fileStyle =
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      )}
      {rows > 1 ? (
        <textarea
          ref={setRef}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={className ?? `${baseStyle} resize-none overflow-hidden`}
        />
      ) : (
        <input
          ref={setRef}
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
});

export default Input;
