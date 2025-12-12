import { motion } from 'motion/react';
import { Search, Rocket, Coins, Flame } from 'lucide-react';

interface FeaturesProps {
  setActiveTab: (tab: string) => void;
}

const features = [
  {
    id: 'balance',
    icon: Search,
    title: 'Balance Check',
    description: 'Check token balances for ERC20, ERC721, and ERC1155 tokens across any wallet address.',
    color: 'from-blue-400 to-cyan-600',
  },
  {
    id: 'deploy',
    icon: Rocket,
    title: 'Deploy Token',
    description: 'Deploy your own ERC20, ERC721, or ERC1155 token smart contracts in seconds.',
    color: 'from-purple-400 to-pink-600',
  },
  {
    id: 'mint',
    icon: Coins,
    title: 'Mint Token',
    description: 'Mint new tokens or NFTs to any address with custom metadata and token URIs.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 'burn',
    icon: Flame,
    title: 'Burn Token',
    description: 'Burn tokens to reduce supply. Automatically fetches token IDs from your contracts.',
    color: 'from-orange-400 to-red-600',
  },
];

export function Features({ setActiveTab }: FeaturesProps) {
  const handleFeatureClick = (id: string) => {
    setActiveTab(id);
    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Powerful Blockchain Tools
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage your token ecosystem in one place
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => handleFeatureClick(feature.id)}
              className="relative group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all h-full">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
