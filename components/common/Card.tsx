import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, onClick }) => {
  return (
    <div 
      className={`bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:border-white/20 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && <h2 className="text-xl font-bold text-white mb-4 border-b pb-2 border-white/10">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;