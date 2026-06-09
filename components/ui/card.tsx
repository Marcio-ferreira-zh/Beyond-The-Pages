import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  className = "",
  ...props
}) => {
  const baseStyles = "gold-glass rounded-xl overflow-hidden relative";
  const hoverStyles = hoverEffect ? "gold-glass-hover transition-all duration-300" : "";
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {/* Removed the blue/gold top bar line as requested */}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`p-4 pb-2 flex flex-col gap-0.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <h3 className={`text-gold-light font-serif text-lg font-bold ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <p className={`text-white/50 text-[10px] uppercase tracking-wider font-semibold ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`p-4 pt-1 text-sm text-white/80 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`p-4 pt-0 border-t border-white/5 flex items-center justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};
