import { useState } from "react";
import { useTransfer } from "../context/TransferContext";
import { useWallet } from "../context/WalletContext";

export default function WalletInfo() {
  const { eoa, aaWallet, login, logout, walletData } = useWallet();
  const { transfer } = useTransfer();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    try {
      const txHash = await transfer(destination, amount);
      alert(`Transferência enviada! Tx hash: ${txHash}`);
    } catch (e) {
      alert("Erro na transferência");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 Web3Auth + AA Wallet</h1>
      {!eoa ? (
        <button onClick={login}>Login com Google</button>
      ) : (
        <>
          <button onClick={() => logout()}>Logout</button>
          <br />
          <p>EOA: {eoa}</p>
          <p>AA Wallet: {aaWallet}</p>

          <p>Saldo: { walletData.balance }</p>

          <input type="text" onChange={e => setDestination(e.target.value)} placeholder="Endereço de destino" />
          <input type="number" onChange={e => setAmount(e.target.value)} placeholder="Quantidade (NERO)" />
          <br />
          <button onClick={handleTransfer}>Transferir 0.01 NERO</button>
        </>
      )}
    </div>
  );
}
