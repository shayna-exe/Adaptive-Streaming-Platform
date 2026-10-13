import React from 'react';

export function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50">
          <h3 className="text-sm font-medium text-gray-200">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export default Card;
