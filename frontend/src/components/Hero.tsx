import { useState, useEffect } from 'react';
import { Heart, ArrowRight, Wallet, TrendingUp } from 'lucide-react';
import { WalletConnect } from './WalletConnect';
import { DonateModal } from './DonateModal';
import { useWeb3 } from '../hooks/useWeb3';

export function Hero() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const { goal, raisedAmount, account, isOwner, goalMet, withdrawFunds } = useWeb3();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const progressPercentage = goal !== '0' 
    ? (parseFloat(raisedAmount) / parseFloat(goal)) * 100 
    : 0;

  const excessAmount = goalMet 
    ? parseFloat(raisedAmount) - parseFloat(goal)
    : 0;

  const scrollToMission = () => {
    const missionSection = document.getElementById('mission');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawFunds();
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="relative h-screen">
      <img
        src="https://images.unsplash.com/photo-1613377512409-59c33c10c821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMG1lZGljYWwlMjBjYXJlfGVufDF8fHx8MTc2NTU1Mjk3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Hospital medical care"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70" />
      
      {/* Wallet Connect - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <WalletConnect />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="max-w-2xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
            <span className="text-pink-400">Lesela Medical Center</span>
          </div>
          <h1 className="mb-6">Together We Fight Cancer</h1>
          <p className="text-xl mb-8 text-blue-100">
            Join us in our mission to provide world-class cancer treatment and research. 
            Every donation brings hope to patients and their families.
          </p>

          {/* Funding Progress */}
          {account && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
              {goalMet && (
                <div className="mb-3 px-4 py-2 bg-green-500/20 border border-green-400 rounded-lg text-center">
                  <span className="text-green-300">
                    🎉 Goal Reached! 
                    {excessAmount > 0 && (
                      <span className="ml-2">
                        +{excessAmount.toFixed(2)} ETH over goal! 🚀
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-sm text-blue-100">Raised</span>
                <span className="text-sm text-blue-100">Goal</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-2xl">{parseFloat(raisedAmount).toFixed(2)} ETH</span>
                <span className="text-2xl">{parseFloat(goal).toFixed(2)} ETH</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercentage > 100 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-pink-400 to-pink-600'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-blue-100">
                  {progressPercentage.toFixed(1)}% funded
                </p>
                {progressPercentage > 100 && (
                  <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-400">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span className="text-xs text-green-300">
                      {(progressPercentage - 100).toFixed(1)}% over goal
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsDonateModalOpen(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              Donate Now
              <Heart className="w-5 h-5" fill="currentColor" />
            </button>
            
            {/* Withdraw button - only visible for owner when goal is met */}
            {isOwner && goalMet && (
              <button 
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isWithdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
                <Wallet className="w-5 h-5" />
              </button>
            )}
            
            <button 
              onClick={scrollToMission}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors border border-white/30"
            >
              Learn More
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <DonateModal 
        isOpen={isDonateModalOpen} 
        onClose={() => setIsDonateModalOpen(false)} 
      />
    </div>
  );
}