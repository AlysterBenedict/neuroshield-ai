
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';

const Index = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={false}
        onLogin={() => setIsAuthModalOpen(true)}
      />
      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <HowItWorks />
        <TestimonialSection />
      </main>
      <Footer />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
