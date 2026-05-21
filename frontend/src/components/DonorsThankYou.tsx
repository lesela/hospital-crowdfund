import { useState, useEffect } from 'react';
import { Heart, Users } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../contract/config';
import { CROWDFUND_ABI } from '../contract/abi';
import { useWeb3 } from '../hooks/useWeb3';

interface Donor {
  address: string;
  amount: string;
}

export function DonorsThankYou() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();

  useEffect(() => {
    fetchDonors();
  }, [account]);

  const fetchDonors = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUND_ABI, provider);

      // Fetch DonationReceived events
      const filter = contract.filters.DonationReceived();
      const events = await contract.queryFilter(filter);

      // Aggregate donations by address
      const donorMap = new Map<string, { amount: bigint }>();
      
      for (const event of events) {
        const donor = event.args?.[0] as string;
        const amount = event.args?.[1] as bigint;
        
        if (donor && amount) {
          const existing = donorMap.get(donor);
          if (existing) {
            donorMap.set(donor, {
              amount: existing.amount + amount
            });
          } else {
            donorMap.set(donor, {
              amount: amount
            });
          }
        }
      }

      // Convert to array and sort by amount (highest first)
      const donorList = Array.from(donorMap.entries())
        .map(([address, data]) => ({
          address,
          amount: ethers.formatEther(data.amount)
        }))
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

      setDonors(donorList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return null; // Don't show if wallet not connected
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-pink-500" fill="currentColor" />
            <Users className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="mb-4 text-blue-900">Thank You to Our Generous Donors</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your contributions are making a real difference in the fight against cancer. 
            We are grateful for your support and generosity.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-600">Loading donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center bg-white rounded-xl p-12 shadow-sm border border-gray-100">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Be the first to donate and see your address here!</p>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-pink-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 rounded-full p-3">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Donors</p>
                    <p className="text-2xl text-gray-900">{donors.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Heart className="w-6 h-6 text-blue-600" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Raised</p>
                    <p className="text-2xl text-gray-900">
                      {donors.reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(4)} ETH
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor, index) => (
                <div 
                  key={`${donor.address}-${index}`}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <span className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      <div className="bg-gradient-to-r from-pink-500 to-blue-500 rounded-full p-2">
                        <Heart className="w-4 h-4 text-white" fill="currentColor" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Donor Address</p>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {formatAddress(donor.address)}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Donated</span>
                      <span className="text-lg text-pink-600">
                        {parseFloat(donor.amount).toFixed(4)} ETH
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                💙 Every contribution, no matter the size, makes a difference. Thank you for your support! 💙
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}