import './App.css';
import WalletInfo from './components/WalletInfo';
import { OverlayProviders } from './context';

function App() {
  return (
    <OverlayProviders>
      <WalletInfo />
    </OverlayProviders>
  );
}

export default App;
