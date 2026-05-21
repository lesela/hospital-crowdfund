import { Hero } from './components/Hero';
import { DonorsThankYou } from './components/DonorsThankYou';
import { Mission } from './components/Mission';
import { Impact } from './components/Impact';
import { HowToHelp } from './components/HowToHelp';
import { Stories } from './components/Stories';
import { Footer } from './components/Footer';
import { Web3Provider } from './hooks/useWeb3';

export default function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen">
        <Hero />
        <DonorsThankYou />
        <Mission />
        <Impact />
        <HowToHelp />
        <Stories />
        <Footer />
      </div>
    </Web3Provider>
  );
}