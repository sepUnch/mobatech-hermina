"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/Button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  description = "Apakah Anda yakin ingin menghapus data ini?",
  isLoading = false,
}: DeleteModalProps) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="w-full max-w-sm glass-card rounded-2xl shadow-2xl p-6 relative z-[101] animate-slide-in">
        <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-foreground/70 mb-6 leading-relaxed">{description}</p>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="ghost"
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="danger"
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
