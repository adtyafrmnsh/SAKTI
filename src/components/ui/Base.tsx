import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`neo-card p-6 ${className}`}
  >
    {children}
  </motion.div>
);

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'primary' | 'secondary' | 'black';
  disabled?: boolean;
}

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = "", 
  variant = 'primary',
  disabled = false
}: ButtonProps) => {
  const variantClass = variant === 'primary' ? 'neo-btn-primary' : 'neo-btn';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};
