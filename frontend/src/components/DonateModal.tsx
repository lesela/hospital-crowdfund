import { useState } from 'react';
import { X, Heart, Loader2 } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';
import { ethers } from 'ethers';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const { account, contract, refreshData } = useWeb3();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const presetAmounts = ['0.1', '0.5', '1', '2'];

  const handleDonate = async () => {
    if (!contract || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setTxHash('');

    try {
      // Send transaction directly through MetaMask
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: contract.target,
          value: '0x' + BigInt(ethers.parseEther(amount).toString()).toString(16),
          data: contract.interface.encodeFunctionData('donate', [])
        }]
      });

      setTxHash(txHash);
      
      // Wait for transaction to be mined
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Thank you for your donation of ${amount} ETH! 🎉`);
      await refreshData();
      setAmount('');
      onClose();
    } catch (error: any) {
      console.error('Donation error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        alert('Transaction was rejected');
      } else {
        alert('Transaction failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setTxHash('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-600" fill="currentColor" />
          </div>
          <div>
            <h3 className="text-2xl">Make a Donation</h3>
            <p className="text-gray-600">Support cancer research & treatment</p>
          </div>
        </div>

        {!account ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please connect your wallet to donate</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Donation Amount (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Quick select:</p>
              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    disabled={isLoading}
                    className="border border-gray-300 hover:border-pink-500 hover:bg-pink-50 rounded-lg py-2 transition-colors disabled:opacity-50"
                  >
                    {preset} ETH
                  </button>
                ))}
              </div>
            </div>

            {txHash && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Transaction submitted: {txHash.substring(0, 10)}...
                </p>
              </div>
            )}

            <button
              onClick={handleDonate}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" fill="currentColor" />
                  Donate Now
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}