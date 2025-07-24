import { Input as MTInput } from "@material-tailwind/react";
import { forwardRef } from "react";

// Base Input Component
const Input = forwardRef(
  (
    {
      label,
      error,
      success,
      helperText,
      className = "",
      containerClassName = "",
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        <MTInput
          ref={ref}
          label={required ? `${label} *` : label}
          error={!!error}
          success={success}
          size="lg"
          variant="outlined"
          className={`${className}`}
          {...props}
        />
        {(error || helperText) && (
          <div className="mt-1">
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
            {!error && helperText && (
              <p className="text-xs text-gray-600">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

// Textarea Component
const Textarea = forwardRef((props, ref) => (
  <Input ref={ref} {...props} textarea rows={props.rows || 4} />
));

// Password Input Component
const PasswordInput = forwardRef(
  ({ showPassword, onTogglePassword, ...props }, ref) => (
    <Input
      ref={ref}
      type={showPassword ? "text" : "password"}
      icon={
        <button
          type="button"
          onClick={onTogglePassword}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {showPassword ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415M14.828 14.828L16.242 16.242"
              />
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </>
            )}
          </svg>
        </button>
      }
      {...props}
    />
  )
);

// Add display names
Input.displayName = "Input";
Textarea.displayName = "Textarea";
PasswordInput.displayName = "PasswordInput";

export { Input, Textarea, PasswordInput };
