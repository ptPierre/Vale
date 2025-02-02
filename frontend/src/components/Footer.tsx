import { Github } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-zinc-900/50 text-gray-300 py-8 mt-auto border-t border-orange-500/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm font-light tracking-wide text-gray-400">
            © {currentYear} Vale. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-8">
            <a 
              href="https://github.com/ptPierre/Vale" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-orange-400 transform transition-all duration-300 ease-in-out group"
            >
              <Github 
                size={20} 
                strokeWidth={1.5}
                className="group-hover:scale-110" 
              />
            </a>
            <a 
              href="/privacy" 
              className="text-sm font-light tracking-wide text-gray-400 hover:text-orange-400 transition-colors duration-300"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};