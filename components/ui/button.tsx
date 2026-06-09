import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-sans font-semibold rounded transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 select-none active:scale-[0.98]";
  
  const variants = {
    primary:
      "bg-gradient-to-r from-gold to-gold-light text-[#1a0c05] hover:brightness-110 shadow-[0_4px_15px_rgba(197,160,89,0.25)] border border-gold-light/20",
    secondary:
      "bg-[#2a1810]/60 text-gold-light border border-gold/30 hover:bg-[#2a1810] hover:border-gold-light/50",
    ghost:
      "text-white/70 hover:text-gold-light hover:bg-[#2a1810]/40",
    danger:
      "bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/30 hover:border-red-500/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wide uppercase",
    md: "px-5 py-2.5 text-sm tracking-wider uppercase",
    lg: "px-7 py-3.5 text-base tracking-widest uppercase",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
