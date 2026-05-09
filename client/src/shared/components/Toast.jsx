import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl animate-fade-in text-white ${type === 'success' ? 'bg-slate-900' : 'bg-red-500'}`}>
      {type === 'success' && <CheckCircle2 size={18} className="text-green-400" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
