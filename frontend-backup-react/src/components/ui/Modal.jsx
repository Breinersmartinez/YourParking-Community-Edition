import { X } from 'lucide-react';

export default function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-700 bg-ink-900 shadow-cardHover">
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="btn-ghost btn-sm">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-neutral-800 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
