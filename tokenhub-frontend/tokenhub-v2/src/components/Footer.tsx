import { motion } from 'motion/react';
import { Wallet, Github, Mail } from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/KoKhant02', label: 'Github' },
  { icon: Mail, href: 'mailto:your.email@example.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-white">TokenHub</span>
            </motion.div>
            <p className="text-gray-400 text-center md:text-left max-w-xs">
              A modern blockchain portfolio project showcasing token management capabilities.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-400 text-sm">Connect with me</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 TokenHub. Built with React, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}