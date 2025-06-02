import { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CommonContext, useCommonContext } from './CommonContext';

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const Web3AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const { web3Config } = useCommonContext();

  useEffect(() => {
    const init = async () => {
      if (!web3Config) return;

      const w3auth = new Web3Auth(web3Config);
      await w3auth.initModal();
      setWeb3auth(w3auth);
    };

    init();
  }, [web3Config]);

  return (
    <Web3AuthContext.Provider value={{ web3auth }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) throw new Error('useWeb3Auth deve ser usado dentro de um Web3AuthProvider');
  return context;
};