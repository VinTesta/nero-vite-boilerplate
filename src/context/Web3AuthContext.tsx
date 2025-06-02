import { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { CommonContext } from './GeneralContext';

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const Web3AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  // const { config, privateKeyProvider } = useContext(CommonContext);

  useEffect(() => {
    const init = async () => {
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x2b1",
        rpcTarget: "https://rpc-testnet.nerochain.io",
        displayName: "Nerochain Testnet",
        blockExplorer: "https://testnet.neroscan.com",
        ticker: "NERO",
        tickerName: "Nero",
      };

      const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

      const w3auth = new Web3Auth({
        clientId: "BEfP_UoMxsGGAwD5WUX5b3K38QiHHZuTfru_HxdkIQ9Hwsdr6MvUfBL7sfm_7v1lEAtbivG0gXOxrOaNaEBUXV4",
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x2b1",
          rpcTarget: "https://rpc-testnet.nerochain.io",
        },
        privateKeyProvider,
        uiConfig: { appName: "AATest" },
      });

      await w3auth.initModal();
      setWeb3auth(w3auth);
    };

    init();
  }, []);

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