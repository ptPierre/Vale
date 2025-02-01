import * as React from "react";
import { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { WalletConnector } from './WalletConnector';
import logo from '../assets/logo_text.png';

export const Header: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`relative text-base font-medium transition-all duration-300 group ${
        isActive(to) 
          ? 'text-orange-400' 
          : 'text-gray-300 hover:text-orange-400'
      }`}
    >
      {children}
      <span className={`absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transform scale-x-0 transition-transform duration-300 ${
        isActive(to) ? 'scale-x-100 animate-pulse' : 'group-hover:scale-x-100'
      }`}/>
    </Link>
  );

  return (
    <header className="fixed top-0 w-full bg-zinc-900/90 backdrop-blur-lg border-b border-orange-500/10 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <Link 
            to="/" 
            className="flex items-center h-full px-2 group transition-transform duration-300"
          >
            <img 
              src={logo} 
              alt="Vale Logo" 
              className="h-[40px] w-auto object-contain filter drop-shadow-lg"
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-16">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/borrowing">Borrow</NavLink>
            <NavLink to="/lending">Lend</NavLink>
            <div>
              <WalletConnector />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-orange-400 focus:outline-none transition-colors duration-300"
          >
            <svg
              className={`w-8 h-8 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden absolute top-18 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-b border-orange-500/10 py-4 transform origin-top transition-all duration-300 ease-out ${
          isOpen 
            ? 'translate-y-0 opacity-100 scale-y-100' 
            : '-translate-y-4 opacity-0 scale-y-0'
        }`}>
          <div className="flex flex-col items-center space-y-6">
            <NavLink to="/">
              <span className="block px-4 py-2 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
                Home
              </span>
            </NavLink>
            <NavLink to="/borrowing">
              <span className="block px-4 py-2 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
                Borrow
              </span>
            </NavLink>
            <NavLink to="/lending">
              <span className="block px-4 py-2 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
                Lend
              </span>
            </NavLink>
            <div className="mt-4">
              <WalletConnector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};