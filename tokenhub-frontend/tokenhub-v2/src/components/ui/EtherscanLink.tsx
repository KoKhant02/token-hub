import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

interface EtherscanLinkProps {
  address: string;
  type?: 'address' | 'tx';
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function EtherscanLink({
  address,
  type = 'address',
  label,
  className = '',
  showIcon = true,
}: EtherscanLinkProps) {
  const baseUrl = 'https://sepolia.etherscan.io';
  const url = type === 'tx' ? `${baseUrl}/tx/${address}` : `${baseUrl}/address/${address}`;

  return (
    <motion.a
      whileHover={{ scale: 1.05 }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 ${className}`}
    >
      {label || (type === 'tx' ? 'View Transaction' : 'View on Etherscan')}
      {showIcon && <ExternalLink className="w-4 h-4" />}
    </motion.a>
  );
}
