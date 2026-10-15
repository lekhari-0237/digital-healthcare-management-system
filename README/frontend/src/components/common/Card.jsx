import React from 'react';

export default function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm ${
        hover ? 'hover:shadow-md hover:border-slate-200 transition duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
