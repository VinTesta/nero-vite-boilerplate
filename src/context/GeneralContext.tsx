import { createContext, useContext, useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, type IBaseProvider, type WEB3AUTH_NETWORK_TYPE } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import type { WEB3AUTH_SAPPHIRE_NETWORK_TYPE } from '@web3auth/auth-adapter';

export interface ChainConfig {
  chainNamespace: "eip155";
  chainId: string
  rpcTarget: string
  displayName: string
  blockExplorer: string
  ticker: string
  tickerName: string,
};

export interface Web3Config {
  clientId: string;
  web3AuthNetwork: WEB3AUTH_SAPPHIRE_NETWORK_TYPE;
  uiConfig: { appName: "AATest" },
  chainConfig: ChainConfig;
}

export interface CommonContextType {
  clientId: string;
  web3authNetwork: WEB3AUTH_NETWORK_TYPE | undefined;
  uiConfig: { appName: "AATest" },
  privateKeyProvider: IBaseProvider<string>;
  chainConfig: {
    chainNamespace: "eip155";
    chainId: string;
    rpcTarget: string;
    displayName: string;
    blockExplorer: string;
    ticker: string;
    tickerName: string;
  }
}

export const CommonContext = createContext<CommonContextType | undefined>(undefined);

export const CommonProvider = ({ children, _web3Config }: { children: React.ReactNode, _web3Config: Web3Config}) => {
  const [chainConfig, setChainConfig] = useState<ChainConfig>(_web3Config.chainConfig);
  const [commonConfig, setCommonConfig] = useState<CommonContextType>();

  useEffect(() => {
    const initConfig = async () => {
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig
        }
      });
      
      setCommonConfig({
        clientId: _web3Config.clientId,
        web3authNetwork: _web3Config.web3AuthNetwork,
        uiConfig: _web3Config.uiConfig,
        privateKeyProvider,
        chainConfig: {
          chainNamespace: "eip155",
          chainId: chainConfig.chainId,
          rpcTarget: chainConfig.rpcTarget,
          displayName: chainConfig.displayName,
          blockExplorer: chainConfig.blockExplorer,
          ticker: chainConfig.ticker,
          tickerName: chainConfig.tickerName
        }
      }
      )
    };

    initConfig();
  }, []);

  return (
    <CommonContext.Provider value={ commonConfig }>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommonContext = () => {
  const context = useContext(CommonContext);
  if (!context) throw new Error('useCommonContext must be used within a CommonProvider');
  return context;
};