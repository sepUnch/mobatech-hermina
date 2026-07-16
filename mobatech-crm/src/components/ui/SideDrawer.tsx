"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function SideDrawer({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`relative w-full max-w-md h-full bg-white/90 dark:bg-[#113C2B]/90 backdrop-blur-xl saturate-150 border-l border-glass-border shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-glass-border/50 bg-black/5 dark:bg-white/5 shrink-0">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
          >
            <X size={20} className="text-foreground/80" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-foreground/80 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
