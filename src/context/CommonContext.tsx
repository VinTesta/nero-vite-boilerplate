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

export interface BasicWeb3Config {
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

export interface NeroConfig {
  rpcUrl: string;
  bundlerUrl: string;
  entryPoint: string;
  paymasterRpc: string;
}

export interface ConfigType {
  web3Config: CommonContextType
  neroConfig: NeroConfig
}

export const CommonContext = createContext<ConfigType | undefined>(undefined);

export const CommonProvider = ({ children, _web3Config, _neroConfig }: { children: React.ReactNode, _web3Config: BasicWeb3Config, _neroConfig: NeroConfig}) => {
  const [chainConfig, setChainConfig] = useState<ChainConfig>(_web3Config.chainConfig);
  const [neroConfig, setNeroConfig] = useState<NeroConfig>(_neroConfig);
  const [commonConfig, setCommonConfig] = useState<CommonContextType>();
  const [baseConfig, setBaseConfig] = useState<ConfigType>();

  useEffect(() => {
    const initConfig = async () => {
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig
        }
      });

      const newCommonConfig: CommonContextType = {
        clientId: _web3Config.clientId,
        web3authNetwork: _web3Config.web3AuthNetwork,
        uiConfig: _web3Config.uiConfig,
        privateKeyProvider,
        chainConfig
      };

      setCommonConfig(newCommonConfig);

      setBaseConfig({
        neroConfig: neroConfig,
        web3Config: newCommonConfig
      });
    };

    initConfig();
  }, []);

  if (!baseConfig) {
    return <div>Loading...</div>; 
  }

  return (
    <CommonContext.Provider value={baseConfig}>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommonContext = () => {
  const context = useContext(CommonContext);
  if (!context) throw new Error('useCommonContext must be used within a CommonProvider');
  return context;
};