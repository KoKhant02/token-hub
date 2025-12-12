import { motion } from 'motion/react';

interface TokenTypeTabsProps {
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
  onTokenTypeChange: (type: 'ERC20' | 'ERC721' | 'ERC1155') => void;
  accentColor?: 'cyan' | 'purple' | 'green' | 'orange';
}

export function TokenTypeTabs({
  tokenType,
  onTokenTypeChange,
  accentColor = 'cyan',
}: TokenTypeTabsProps) {
  const tokenTypes: ('ERC20' | 'ERC721' | 'ERC1155')[] = ['ERC20', 'ERC721', 'ERC1155'];

  const accentColors = {
    cyan: {
      active: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
      inactive: 'bg-white/5 text-gray-400 hover:bg-white/10',
    },
    purple: {
      active: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white',
      inactive: 'bg-white/5 text-gray-400 hover:bg-white/10',
    },
    green: {
      active: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
      inactive: 'bg-white/5 text-gray-400 hover:bg-white/10',
    },
    orange: {
      active: 'bg-gradient-to-r from-orange-500 to-red-600 text-white',
      inactive: 'bg-white/5 text-gray-400 hover:bg-white/10',
    },
  };

  const colors = accentColors[accentColor];

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Token Type</label>
      <div className="grid grid-cols-3 gap-3">
        {tokenTypes.map((type) => (
          <motion.button
            key={type}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTokenTypeChange(type)}
            className={`py-3 rounded-lg transition-all ${
              tokenType === type ? colors.active : colors.inactive
            }`}
          >
            {type}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
