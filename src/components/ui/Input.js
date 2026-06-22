import { forwardRef } from "react";

const Input = forwardRef(({ className = "", label, id, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={id} className="font-button-text text-button-text text-ink-text">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full bg-white border border-outline-variant rounded-lg px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all ${
          error ? "border-error" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="font-body-md text-error text-sm">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
