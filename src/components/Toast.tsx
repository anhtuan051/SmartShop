import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-white/95 text-slate-800 shadow-emerald-100/50',
    error: 'border-rose-200 bg-white/95 text-slate-800 shadow-rose-100/50',
    info: 'border-blue-200 bg-white/95 text-slate-800 shadow-blue-100/50',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in">
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all ${
          bgStyles[toast.type]
        }`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
