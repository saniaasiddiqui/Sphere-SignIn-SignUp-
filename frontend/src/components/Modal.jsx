import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, children, width = "max-w-md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/45 px-4 animate-rise">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${width} rounded-card bg-white shadow-pop animate-rise`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export function ModalCloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-md text-ink-950/40 hover:bg-canvas hover:text-ink-950"
    >
      <X size={18} />
    </button>
  );
}
