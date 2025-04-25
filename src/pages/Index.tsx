
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isAuthenticated}
        onLogout={logout}
      />
      <main className="flex-1">
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <HowItWorks />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
