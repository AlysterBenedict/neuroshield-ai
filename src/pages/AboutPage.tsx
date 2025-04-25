
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const AboutPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isAuthenticated}
        onLogin={() => {}}
        onLogout={logout}
      />
      <main className="flex-1 pt-20">
        <section className="py-16 px-6 bg-background">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">About NeuroShield AI</h1>
            <p className="text-lg mb-6">
              NeuroShield AI was founded with a simple yet powerful mission: to make early 
              detection of neurological disorders accessible to everyone, everywhere.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
            <p className="mb-6">
              Our mission is to revolutionize neurological healthcare by providing affordable, 
              accessible, and non-invasive screening tools that can detect early signs of 
              neurological conditions years before traditional diagnostic methods.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Vision</h2>
            <p className="mb-6">
              We envision a world where devastating neurological diseases are caught at their 
              earliest stages, when intervention is most effective and quality of life can be 
              preserved. Our AI-powered platform uses multimodal analysis—combining visual, 
              vocal, and cognitive indicators—to identify subtle patterns that human observation 
              might miss.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="neuroshield-card p-6">
                <div className="h-20 w-20 rounded-full bg-neuroshield-blue flex items-center justify-center text-white text-2xl font-bold mb-4">
                  JD
                </div>
                <h3 className="text-xl font-semibold mb-2">Dr. Jane Doe</h3>
                <p className="text-muted-foreground">Founder & Chief Neuroscience Officer</p>
                <p className="mt-3">
                  Neurologist with 15 years of clinical experience specializing in early 
                  detection of neurodegenerative diseases.
                </p>
              </div>
              
              <div className="neuroshield-card p-6">
                <div className="h-20 w-20 rounded-full bg-neuroshield-purple flex items-center justify-center text-white text-2xl font-bold mb-4">
                  JS
                </div>
                <h3 className="text-xl font-semibold mb-2">John Smith, PhD</h3>
                <p className="text-muted-foreground">Chief AI Officer</p>
                <p className="mt-3">
                  Machine learning expert with background in computer vision and 
                  biomarker detection algorithms.
                </p>
              </div>
              
              <div className="neuroshield-card p-6">
                <div className="h-20 w-20 rounded-full bg-neuroshield-green flex items-center justify-center text-white text-2xl font-bold mb-4">
                  AT
                </div>
                <h3 className="text-xl font-semibold mb-2">Alice Thompson</h3>
                <p className="text-muted-foreground">Head of Product</p>
                <p className="mt-3">
                  Healthcare technology leader focused on creating intuitive products 
                  that bridge the gap between complex technology and everyday users.
                </p>
              </div>
              
              <div className="neuroshield-card p-6">
                <div className="h-20 w-20 rounded-full bg-neuroshield-orange flex items-center justify-center text-white text-2xl font-bold mb-4">
                  RJ
                </div>
                <h3 className="text-xl font-semibold mb-2">Robert Johnson</h3>
                <p className="text-muted-foreground">CTO</p>
                <p className="mt-3">
                  Technology leader with expertise in building secure, scalable healthcare 
                  platforms and managing sensitive patient data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
