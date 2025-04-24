
import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      title: "Computer Vision Analysis",
      description: "Detects facial micro-expressions, eye movement patterns, and subtle hand tremors using your device's camera.",
      icon: "🔍"
    },
    {
      title: "Voice Analysis",
      description: "Analyzes speech patterns, rhythm variations, and voice tremors to identify early signs of neurological changes.",
      icon: "🎤"
    },
    {
      title: "Multimodal AI Fusion",
      description: "Combines visual and audio biomarkers using our proprietary UFNet technology for more accurate assessments.",
      icon: "🧠"
    },
    {
      title: "Longitudinal Tracking",
      description: "Monitors changes over time with personalized dashboards showing trends and potential warning signs.",
      icon: "📊"
    }
  ];

  return (
    <div className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Advanced Neural Monitoring</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Our AI-powered platform uses multiple data streams to provide comprehensive 
            neurological assessments in just minutes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="neuroshield-card p-6 flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
