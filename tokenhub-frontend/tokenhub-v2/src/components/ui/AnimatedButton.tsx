import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function AnimatedButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/50',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:shadow-green-500/50',
    danger: 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-xl hover:shadow-orange-500/50',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
    link: 'bg-transparent text-cyan-400 hover:text-cyan-300',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={`px-8 py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
        variants[variant]
      } ${fullWidth ? 'w-full' : ''} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  );
}
