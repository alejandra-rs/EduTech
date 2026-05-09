import React, { forwardRef, useRef, useEffect, useLayoutEffect, useCallback } from "react";

type InputProps = (
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
) & {
  label?: string;
  textarea?: boolean;
  autoResize?: boolean;
  noBorder?: boolean;
  type?: string;
  row?: number;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({
    label,
    placeholder = "Value",
    textarea = false,
    value,
    onChange,
    type = "text",
    required = false,
    className = "",
    id,
    autoResize = false,
    noBorder = false,
    row = 1,
    ...props
  }, forwardedRef) => {

    const localRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    const setRef = useCallback((node: HTMLInputElement | HTMLTextAreaElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = node;
      }
    }, [forwardedRef]);

    useIsomorphicLayoutEffect(() => {
      if (!autoResize || !textarea) return;
      
      const el = localRef.current as HTMLTextAreaElement;
      if (!el) return;

      const adjustHeight = () => {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      };
      adjustHeight();
      el.addEventListener("input", adjustHeight);
      
      return () => {
        el.removeEventListener("input", adjustHeight);
      };
    }, [value, autoResize, textarea]);

    const baseStyle = noBorder
      ? "w-full rounded-lg p-3 outline-none transition-all text-gray-800"
      : "w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-zinc-500 outline-none transition-all bg-white text-gray-800";
    
    const fileStyle =
      "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 cursor-pointer";
    const textAreaClassName = `${baseStyle} ${autoResize ? 'resize-none overflow-hidden' : ''} ${className}`.trim();
    
    const inputClassName = `${type === "file" ? fileStyle : baseStyle} ${className}`.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        {textarea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={setRef}
            id={id}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            required={required}
            placeholder={placeholder}
            rows={row}
            className={textAreaClassName}
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={setRef}
            id={id}
            type={type}
            value={type === "file" ? undefined : value}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            required={required}
            placeholder={placeholder}
            className={inputClassName}
          />
        )}
      </div>
    );
});

Input.displayName = "Input";

export default Input;