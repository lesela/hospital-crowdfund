import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { CROWDFUND_ABI } from '../contract/abi';
import { CONTRACT_ADDRESS, GANACHE_NETWORK } from '../contract/config';

interface Web3ContextType {
  account: string | null;
  contract: ethers.Contract | null;
  provider: ethers.JsonRpcProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  goal: string;
  raisedAmount: string;
  owner: string;
  refreshData: () => Promise<void>;
  withdrawFunds: () => Promise<void>;
  isOwner: boolean;
  goalMet: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  contract: null,
  provider: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  goal: '0',
  raisedAmount: '0',
  owner: '',
  refreshData: async () => {},
  withdrawFunds: async () => {},
  isOwner: false,
  goalMet: false
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [goal, setGoal] = useState('0');
  const [raisedAmount, setRaisedAmount] = useState('0');
  const [owner, setOwner] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [goalMet, setGoalMet] = useState(false);

  const refreshData = async () => {
    if (!contract) return;
    
    try {
      const [goalData, raisedData, ownerData] = await Promise.all([
        contract.goal(),
        contract.raisedAmount(),
        contract.owner()
      ]);
      
      setGoal(ethers.formatEther(goalData));
      setRaisedAmount(ethers.formatEther(raisedData));
      setOwner(ownerData);
      setIsOwner(ownerData.toLowerCase() === account?.toLowerCase());
      setGoalMet(raisedData >= goalData);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature!');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Switch to Ganache network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: GANACHE_NETWORK.chainId }],
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [GANACHE_NETWORK],
          });
        }
      }

      // Use BrowserProvider with MetaMask's ethereum provider
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Get signer from MetaMask
      const signer = await browserProvider.getSigner();
      
      const crowdfundContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CROWDFUND_ABI,
        signer
      );

      setAccount(accounts[0]);
      setProvider(browserProvider as any);
      setContract(crowdfundContract);

      // Fetch initial data
      const [goalData, raisedData, ownerData] = await Promise.all([
        crowdfundContract.goal(),
        crowdfundContract.raisedAmount(),
        crowdfundContract.owner()
      ]);

      setGoal(ethers.formatEther(goalData));
      setRaisedAmount(ethers.formatEther(raisedData));
      setOwner(ownerData);
      setIsOwner(ownerData.toLowerCase() === accounts[0].toLowerCase());
      setGoalMet(raisedData >= goalData);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Make sure Ganache is running and MetaMask is configured correctly.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setProvider(null);
    setGoal('0');
    setRaisedAmount('0');
    setOwner('');
    setIsOwner(false);
    setGoalMet(false);
  };

  const withdrawFunds = async () => {
    if (!contract || !isOwner) {
      alert('You must be the owner to withdraw funds.');
      return;
    }
    
    if (!goalMet) {
      alert('Goal has not been met yet. Cannot withdraw funds.');
      return;
    }
    
    try {
      // Send transaction directly through MetaMask
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: contract.target,
          data: contract.interface.encodeFunctionData('withdraw', [])
        }]
      });
      
      // Wait for transaction to be mined
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Funds withdrawn successfully! 💰');
      await refreshData();
    } catch (error: any) {
      console.error('Error withdrawing funds:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        alert('Transaction was rejected');
      } else {
        alert('Failed to withdraw funds. Please try again.');
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        provider,
        connectWallet,
        disconnectWallet,
        isConnecting,
        goal,
        raisedAmount,
        owner,
        refreshData,
        withdrawFunds,
        isOwner,
        goalMet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}