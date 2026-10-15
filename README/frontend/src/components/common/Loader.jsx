import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 text-sky-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="h-8 w-8 text-sky-600 animate-spin" />
      <p className="text-xs font-semibold text-slate-600">{label}</p>
    </div>
  );
}
