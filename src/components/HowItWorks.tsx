
import React from 'react';
import { Card } from '@/components/ui/card';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Record a Session",
      description: "Complete a brief 30-second assessment using your device's camera and microphone.",
      color: "bg-neuroshield-blue"
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our neural networks analyze facial expressions, hand movements, and voice patterns.",
      color: "bg-neuroshield-purple"
    },
    {
      number: "03",
      title: "Get Results",
      description: "Receive a comprehensive analysis with actionable insights about your neurological health.",
      color: "bg-neuroshield-green"
    }
  ];

  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">How NeuroShield Works</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Our advanced AI assessment process is simple, fast, and non-invasive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-none shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`${step.color} h-2 w-full absolute top-0 left-0`}></div>
              <div className="p-6">
                <div className={`${step.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
