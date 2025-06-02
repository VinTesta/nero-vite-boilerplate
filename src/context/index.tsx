// contexts/index.tsx
import { Web3AuthProvider } from './Web3AuthContext';
import { WalletProvider } from './WalletContext';
import { TransferProvider } from './TransferContext';
import { CommonProvider, type Web3Config } from './GeneralContext';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';

export const OverlayProviders = ({ children }: { children: React.ReactNode }) => {

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x2b1",
    rpcTarget: "https://rpc-testnet.nerochain.io",
    displayName: "Nerochain Testnet",
    blockExplorer: "https://testnet.neroscan.com",
    ticker: "NERO",
    tickerName: "Nero",
  };

  const web3Config: Web3Config = {
    clientId: "BEfP_UoMxsGGAwD5WUX5b3K38QiHHZuTfru_HxdkIQ9Hwsdr6MvUfBL7sfm_7v1lEAtbivG0gXOxrOaNaEBUXV4",
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chainConfig,
    uiConfig: { appName: "AATest" },
  }

  return (
    <CommonProvider _web3Config={web3Config}>
      <Web3AuthProvider>
        <WalletProvider>
          <TransferProvider>
            {children}
          </TransferProvider>
        </WalletProvider>
      </Web3AuthProvider>
    </CommonProvider>
  );
};
