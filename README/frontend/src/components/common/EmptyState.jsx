import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No records found', description = 'There are no items to display right now.', icon: Icon = Inbox, actionButton }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm my-6">
      <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">{description}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
