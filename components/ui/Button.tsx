import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseStyles = "font-sans font-bold border-2 border-black transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus:outline-none";
  
  const variants = {
    primary: "bg-retro-red text-white shadow-hard hover:bg-red-700",
    secondary: "bg-retro-teal text-white shadow-hard hover:bg-teal-700",
    outline: "bg-white text-black shadow-hard hover:bg-retro-gray",
    ghost: "bg-transparent border-none shadow-none hover:bg-black/5 active:translate-x-0 active:translate-y-0 text-black",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
