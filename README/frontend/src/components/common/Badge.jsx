import React from 'react';

export default function Badge({ children, variant = 'info', size = 'md' }) {
  const variants = {
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-lg border font-semibold ${variants[variant] || variants.info} ${sizes[size]}`}>
      {children}
    </span>
  );
}
