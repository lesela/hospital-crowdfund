import { Heart, Calendar, Building2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { DonateModal } from './DonateModal';

export function HowToHelp() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const ways = [
    {
      icon: Heart,
      title: 'Make a Donation',
      description: 'Every contribution helps fund critical research and patient care programs.',
      action: 'Donate Now',
      color: 'pink',
      onClick: () => setIsDonateModalOpen(true),
    },
    {
      icon: Calendar,
      title: 'Volunteer',
      description: 'Share your time and skills to support patients and their families.',
      action: 'Join Us',
      color: 'blue',
      onClick: () => {},
    },
    {
      icon: Building2,
      title: 'Corporate Partnership',
      description: 'Partner with us to make a lasting impact in cancer research and treatment.',
      action: 'Learn More',
      color: 'purple',
      onClick: () => {},
    },
    {
      icon: Share2,
      title: 'Spread Awareness',
      description: 'Share our mission with your network and help us reach more people.',
      action: 'Share',
      color: 'green',
      onClick: () => {},
    },
  ];

  const colorClasses = {
    pink: 'bg-pink-100 text-pink-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
  };

  const buttonColorClasses = {
    pink: 'bg-pink-500 hover:bg-pink-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    green: 'bg-green-500 hover:bg-green-600',
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4">How You Can Help</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            There are many ways to support our mission. Choose the one that resonates with you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ways.map((way, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${colorClasses[way.color as keyof typeof colorClasses]} rounded-lg mb-4`}>
                <way.icon className="w-6 h-6" />
              </div>
              <h3 className="mb-2">{way.title}</h3>
              <p className="text-gray-600 mb-4">{way.description}</p>
              <button 
                onClick={way.onClick}
                className={`w-full ${buttonColorClasses[way.color as keyof typeof buttonColorClasses]} text-white px-4 py-2 rounded-lg transition-colors`}
              >
                {way.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      <DonateModal 
        isOpen={isDonateModalOpen} 
        onClose={() => setIsDonateModalOpen(false)} 
      />
    </section>
  );
}