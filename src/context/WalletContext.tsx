import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Auth } from './Web3AuthContext';
import { generateAAWallet } from '../utils/aaUtils';

interface WalletContextType {
  eoa: string;
  aaWallet: string;
  walletData: walletData;
  login: () => Promise<void>;
  logout: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { web3auth } = useWeb3Auth();
  const [eoa, setEoa] = useState('');
  const [aaWallet, setAaWallet] = useState('');
  const [walletData, setWalletData] = useState<walletData>({ balance: 0 });

  const login = async () => {
    if (!web3auth) return;
    const provider = await web3auth.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider as any);
    const signer = ethersProvider.getSigner();
    const eoaAddr = await signer.getAddress();
    const aaAddr = await generateAAWallet(signer);

    setEoa(eoaAddr);
    setAaWallet(aaAddr);
    setWalletData({ ...walletData, balance: 0 });
  };

  const logout = () => {
    setEoa('');
    setAaWallet('');
    if (web3auth) {
      web3auth.logout();
    }
  }

  return (
    <WalletContext.Provider value={{ eoa, aaWallet, login, logout, walletData }}>
      {children}
    </WalletContext.Provider>
  );
};

export interface walletData {
  balance: number
}

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet deve ser usado dentro de um WalletProvider');
  }
  return context;
};
