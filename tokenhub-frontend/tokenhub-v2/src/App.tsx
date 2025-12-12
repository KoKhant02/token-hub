import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Toaster } from 'sonner';
import { BalanceCheck } from './components/BalanceCheck';
import { BurnToken } from './components/BurnToken';
import { DeployToken } from './components/DeployToken';
import { Documentation } from './components/Documentation';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { MintToken } from './components/MintToken';
import { Navigation } from './components/Navigation';
import { Newsletter } from './components/Newsletter';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('balance');
  const [loading, setLoading] = useState(true);

  // Suppress MetaMask auto-connection errors (we use backend API, not direct wallet connection)
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Filter out MetaMask connection errors
      const errorMessage = args.join(' ');
      if (
        errorMessage.includes('MetaMask') ||
        errorMessage.includes('chrome-extension://') ||
        errorMessage.includes('Failed to connect to MetaMask')
      ) {
        return; // Suppress MetaMask-related errors
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Skeleton */}
          <div className="mb-8">
            <Skeleton 
              height={60} 
              baseColor="#1e293b" 
              highlightColor="#334155" 
              borderRadius={12}
            />
          </div>

          {/* Hero Skeleton */}
          <div className="text-center mb-16 mt-20">
            <Skeleton 
              height={80} 
              width="60%" 
              baseColor="#1e293b" 
              highlightColor="#334155" 
              borderRadius={12}
              className="mb-4 mx-auto"
            />
            <Skeleton 
              height={30} 
              width="80%" 
              baseColor="#1e293b" 
              highlightColor="#334155" 
              borderRadius={8}
              className="mb-6 mx-auto"
            />
            <Skeleton 
              height={50} 
              width={200} 
              baseColor="#0891b2" 
              highlightColor="#06b6d4" 
              borderRadius={8}
              className="mx-auto"
            />
          </div>

          {/* Features Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton 
                key={i}
                height={200} 
                baseColor="#1e293b" 
                highlightColor="#334155" 
                borderRadius={16}
              />
            ))}
          </div>

          {/* Tools Section Skeleton */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Skeleton 
              height={500} 
              baseColor="#1e293b" 
              highlightColor="#334155" 
              borderRadius={16}
            />
            <Skeleton 
              height={500} 
              baseColor="#1e293b" 
              highlightColor="#334155" 
              borderRadius={16}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Toaster 
        position="top-right" 
        richColors 
        expand={false}
        closeButton
      />
      <Navigation scrolled={scrolled} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Hero />
      <Features setActiveTab={setActiveTab} />
      <Documentation />
      
      {/* Main Tools Section */}
      <section id="tools" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'balance' && <BalanceCheck />}
          {activeTab === 'deploy' && <DeployToken />}
          {activeTab === 'mint' && <MintToken />}
          {activeTab === 'burn' && <BurnToken />}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}