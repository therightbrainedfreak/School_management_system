import { useId, useState } from "react";

function FloatingLabelSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  className = "",
  ...rest
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const hasValue = value !== undefined && value !== null && value !== "";
  const isFloating = focused || hasValue;

  return (
    <div className={`relative w-fit min-w-40 ${className}`}>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`peer block w-full appearance-none rounded-md border bg-white px-3 pt-5 pb-2 text-sm text-gray-900 outline-none transition
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}
          focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
        {...rest}
      >
        {/* Empty option so the label stays in place until a choice is made */}
        <option value="" disabled hidden />
        {options.map((opt) => {
          const optValue = typeof opt === "object" ? opt.value : opt;
          const optLabel = typeof opt === "object" ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>

      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-3 origin-left transition-all duration-150
          ${isFloating ? "top-1.5 text-xs" : "top-1/2 -translate-y-1/2 text-sm"}
          ${error ? "text-red-500" : focused ? "text-blue-500" : "text-gray-500"}`}
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {/* Chevron icon, since appearance-none removes the native arrow */}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingLabelSelect;