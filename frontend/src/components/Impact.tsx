import { useWeb3 } from '../hooks/useWeb3';

export function Impact() {
  const { raisedAmount, goal, account } = useWeb3();
  
  const stats = [
    { value: '15,000+', label: 'Patients Treated' },
    { value: '95%', label: 'Success Rate' },
    { 
      value: account ? `${parseFloat(raisedAmount).toFixed(2)} ETH` : '$12M', 
      label: account ? 'Blockchain Raised' : 'Research Funding' 
    },
    { value: '50+', label: 'Clinical Trials' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">Making a Real Impact</h2>
            <p className="text-xl text-blue-100 mb-8">
              With your support, we've transformed countless lives and brought hope 
              to families facing cancer. Our commitment to excellence in care and 
              research continues to save lives every day.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="text-4xl mb-2">{stat.value}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1761106082516-61d4c6883f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc2NTU0MDU3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Medical research"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}