import { createContext, useContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

interface Web3ContextType {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  connectWallet: () => Promise<void>;
  isConnecting: boolean;
}

export const Web3Context = createContext<Web3ContextType>({
  address: null,
  provider: null,
  signer: null,
  connectWallet: async () => {},
  isConnecting: false,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this dApp!');
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      setProvider(provider);
      setSigner(signer);
      setAddress(accounts[0]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return (
    <Web3Context.Provider value={{ address, provider, signer, connectWallet, isConnecting }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
