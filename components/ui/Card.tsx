import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white border-2 border-black shadow-hard p-4 ${className}`}>
      {title && (
        <h3 className="font-pixel text-xs md:text-sm mb-4 border-b-2 border-black pb-2 uppercase tracking-wide">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
