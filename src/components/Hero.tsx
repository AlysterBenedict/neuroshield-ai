
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden bg-background pt-20 pb-16 md:py-24 lg:py-32">
      {/* Background elements */}
      <div className="hidden lg:block absolute top-0 right-0 -mr-40 -mt-32">
        <div className="brain-wave h-96 w-96"></div>
      </div>
      <div className="hidden lg:block absolute bottom-0 left-0 -ml-72 -mb-40">
        <div className="brain-wave h-96 w-96"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Early Detection of Neurological Disorders with <span className="text-neuroshield-blue">AI</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            NeuroShield uses advanced AI algorithms to analyze micro-expressions, 
            hand tremors, and voice patterns to detect early signs of neurological conditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-neuroshield-blue text-white hover:bg-neuroshield-blue/90 px-8 py-6 text-lg" 
              onClick={onGetStarted}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-neuroshield-blue text-neuroshield-blue hover:bg-neuroshield-blue/10 px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
