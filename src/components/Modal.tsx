"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-1 shadow-xl"
      >
        <div className="flex justify-end p-2 pb-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Schliessen"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-hover hover:text-foreground cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>
  );
}
