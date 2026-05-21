import { Wallet, LogOut } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

export function WalletConnect() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {formatAddress(account)}
        </div>
        <button
          onClick={disconnectWallet}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors"
          title="Disconnect Wallet"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      <Wallet className="w-5 h-5" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
