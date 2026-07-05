"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 md:p-10">
      {/* Backdrop Backdrop Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
      />

      {/* Modal Wrapper Frame */}
      <div className="w-full max-w-lg border glass-card rounded-2xl relative z-[101] overflow-hidden shadow-2xl animate-slide-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">{children}</div>
      </div>
    </div>,
    document.body
  );
}
