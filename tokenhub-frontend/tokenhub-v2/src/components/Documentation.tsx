import { motion } from 'motion/react';
import { Book, Code, Shield, Zap, FileText, Github, Layers } from 'lucide-react';

const docSections = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of using TokenHub tools',
    color: 'from-blue-400 to-cyan-600',
    content: [
      'Select a tool from the navigation or features section',
      'Use demo values to test functionality without real addresses',
      'Each tool supports ERC20, ERC721, and ERC1155 standards',
      'Results are displayed in real-time with transaction details'
    ]
  },
  {
    icon: Shield,
    title: 'Token Standards',
    description: 'Understanding blockchain token types',
    color: 'from-purple-400 to-pink-600',
    content: [
      'ERC20: Fungible tokens (currencies, utility tokens)',
      'ERC721: Non-fungible tokens (unique NFTs)',
      'ERC1155: Multi-token standard (gaming assets, collectibles)',
      'Each standard has different use cases and features'
    ]
  },
  {
    icon: Code,
    title: 'API Integration',
    description: 'Connect to blockchain networks',
    color: 'from-green-400 to-emerald-600',
    content: [
      'Web3.js or Ethers.js integration ready',
      'Supports Ethereum Testnet',
      'Contract ABIs for all token standards included',
      'Gas optimization for cost-effective transactions'
    ]
  },
  {
    icon: Layers,
    title: 'Architecture',
    description: 'Built with modern blockchain stack',
    color: 'from-orange-400 to-red-600',
    content: [
      'Smart contracts written in Solidity',
      'React + TypeScript frontend with Tailwind CSS',
      'High-performance backend built with Go (Golang)',
      'Motion animations for smooth user experience'
    ]
  }
];

const resources = [
  {
    title: 'Smart Contract Code',
    description: 'View the Solidity contracts on GitHub',
    icon: Github,
    link: 'https://github.com/KoKhant02/token-hub/tree/main/tokenhub-backend/contracts',
    color: 'from-gray-400 to-slate-600'
  },
  {
    title: 'Live Demo',
    description: 'Try the deployed application',
    icon: Zap,
    link: '#',
    color: 'from-blue-400 to-indigo-600'
  }
];

export function Documentation() {
  return (
    <section id="docs" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Documentation
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about using TokenHub
          </p>
        </motion.div>

        {/* Documentation Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {docSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <section.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl text-white mb-2">{section.title}</h3>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {section.content.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-1.5 h-1.5 bg-gradient-to-br ${section.color} rounded-full mt-2 flex-shrink-0`} />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {resources.map((resource, index) => (
            <motion.a
              key={resource.title}
              href={resource.link}
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <resource.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg text-white mb-1">{resource.title}</h4>
                  <p className="text-sm text-gray-400">{resource.description}</p>
                </div>
                <div className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}