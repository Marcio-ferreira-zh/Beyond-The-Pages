import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Card } from "./card";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a0c05]/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`w-full ${widthClasses[maxWidth]} z-10 animate-in fade-in zoom-in-95 duration-200`}>
        <Card className="gold-glass border border-gold/20 shadow-[0_10px_50px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-5 pb-3 flex items-center justify-between border-b border-white/5">
            <h3 className="font-serif text-gold-light text-xl italic font-bold">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-gold-light p-1 rounded transition-colors hover:bg-white/5 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scroll flex-1">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};
