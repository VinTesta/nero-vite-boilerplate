import { createContext, useContext } from 'react';
import { ethers } from 'ethers';
import { useWeb3Auth } from './Web3AuthContext';
import { transferNERO } from '../utils/aaUtils';
import type { UserOperationEventEvent } from 'userop/dist/typechain/EntryPoint';

interface TransferContextType {
  transfer: (to: string, amount: string) => Promise<UserOperationEventEvent | null | undefined>;
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

export const TransferProvider = ({ children }: { children: React.ReactNode }) => {
  const { web3auth } = useWeb3Auth();

  const transfer = async (to: string, amount: string) => {
    if (!web3auth) return;
    const provider = await web3auth.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider as any);
    const signer = ethersProvider.getSigner();

    return await transferNERO(signer, to, amount);
  };

  return (
    <TransferContext.Provider value={{ transfer }}>
      {children}
    </TransferContext.Provider>
  );
};

export const useTransfer = (): TransferContextType => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransfer deve ser usado dentro de um WalletProvider');
  }
  return context;
}
