import * as React from "react";
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-secondary)] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <p className="text-gray-400 text-sm">
            © {currentYear} Vale. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
            >
              Terms
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
            >
              Privacy
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};