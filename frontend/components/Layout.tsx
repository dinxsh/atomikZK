import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BeakerIcon } from '@heroicons/react/24/solid';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background-dark via-background to-background-light opacity-50 animate-gradient-xy" />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md bg-background-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <BeakerIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ZK Proof Generator
              </span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors"
              >
                Connect Wallet
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-gray-400">
            Powered by Cartesi Coprocessor & EigenLayer
          </div>
        </div>
      </footer>
    </div>
  );
} 