import { useId, useState } from "react";

function FloatingLabelInput({
  label,
  type = "text",
  value,
  onChange,
  name,
  required = false,
  error,
  className = "",
  ...rest
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const isFloating = focused || (value !== undefined && value !== null && value !== "");

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        className={`peer block w-fit rounded-md border bg-white px-3 pt-5 pb-2 text-sm text-gray-900 outline-none transition
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}
          focus:ring-1 ${error ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
        {...rest}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-3 origin-left transition-all duration-150
          ${
            isFloating
              ? "top-1.5 text-xs"
              : "top-1/2 -translate-y-1/2 text-sm"
          }
          ${error ? "text-red-500" : isFloating && focused ? "text-blue-500" : "text-gray-500"}`}
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default FloatingLabelInput;