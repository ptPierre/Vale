import * as React from "react";
import { useWeb3 } from '../context/Web3Context';
import { Wallet } from 'lucide-react';

interface WalletConnectorProps {
  className?: string;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ className }) => {
  const { address, connectWallet, isConnecting } = useWeb3();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`
        relative px-6 py-2.5
        font-medium text-white text-sm
        bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
        hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
        rounded-lg
        transition-all duration-200
        hover:shadow-lg hover:shadow-orange-500/25
        disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center space-x-2.5
        overflow-hidden
        group
        ${className}
      `}
    >
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 w-1/2 h-full translate-x-[-150%] group-hover:translate-x-[200%] transform-gpu bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
      
      <Wallet className="w-4 h-4 transition-transform group-active:scale-95" />
      <span className="relative">
        {isConnecting
          ? 'Connecting...'
          : address
          ? truncateAddress(address)
          : 'Connect Wallet'}
      </span>
    </button>
  );
};