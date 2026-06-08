import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  isTextArea?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  isTextArea = false,
  className = "",
  rows = 4,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const baseStyles =
    "w-full bg-[#2a1810]/70 border border-white/10 p-3.5 text-white rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all placeholder:text-white/20 text-sm font-sans";

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-gold-light italic font-serif text-base tracking-wide"
        >
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea
          id={inputId}
          rows={rows}
          className={`${baseStyles} resize-none ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          className={`${baseStyles} ${className}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
};
