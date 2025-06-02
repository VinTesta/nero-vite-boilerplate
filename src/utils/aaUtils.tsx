import { Client, Presets } from 'userop';
import { ethers } from 'ethers';
import { BUNDLER_RPC_URL, ENTRYPOINT_ADDRESS, RPC_URL, ACCOUNT_FACTORY_ADDRESS } from '../config';

export const generateAAWallet = async (signer: ethers.Signer) => {
  const builder = await Presets.Builder.SimpleAccount.init(
    signer, 
    RPC_URL, 
    {
      entryPoint: ENTRYPOINT_ADDRESS,
      factory: ACCOUNT_FACTORY_ADDRESS,
      overrideBundlerRpc: BUNDLER_RPC_URL,
    }
  );

  const aaWalletAddress = await builder.getSender();
  return aaWalletAddress;
};

export const transferNERO = async (
  signer: ethers.Signer,
  to: string,
  amountInEth: string
) => {
  const { client, builder } = await builderClientFactory(signer);

  const value = ethers.utils.parseEther(amountInEth);
  await builder.execute(to, value, '0x');

  const result = await client.sendUserOperation(builder);
  console.log("UserOp Hash:", result.userOpHash);

  const receipt = await result.wait();
  console.log("Tx Hash:", receipt);

  return receipt;
};

export const builderClientFactory = async (signer: ethers.Signer): Promise<{client: Client, builder: Presets.Builder.SimpleAccount}> => {
  if (!signer) {
    throw new Error("Signer is required to initialize the builder and client.");
  }

  const builder = await Presets.Builder.SimpleAccount.init(signer, RPC_URL, {
    entryPoint: ENTRYPOINT_ADDRESS,
    factory: ACCOUNT_FACTORY_ADDRESS,
    overrideBundlerRpc: BUNDLER_RPC_URL,
  });

  const client = await Client.init(RPC_URL, {
    overrideBundlerRpc: BUNDLER_RPC_URL,
  });

  return { builder, client };
}
