import React from 'react';

export function StatusBadge({ text, colorVariant, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorVariant} ${className}`}>
      {text}
    </span>
  );
}

export default StatusBadge;
