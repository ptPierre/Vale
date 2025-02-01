import { createContext, useContext, useState, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner, Eip1193Provider } from 'ethers';

interface Web3ContextType {
  address: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  connectWallet: () => Promise<void>;
  isConnecting: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  provider: null,
  signer: null,
  connectWallet: async () => {},
  isConnecting: false,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this dApp!');
      return;
    }

    try {
      setIsConnecting(true);
      const ethereum = window.ethereum as unknown as Eip1193Provider;
      const provider = new BrowserProvider(ethereum);
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
