
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Brain, Mic, ChartBar, Shield, UserCog, LineChart } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const features = [
    {
      title: "Computer Vision Analysis",
      description: "Our advanced algorithms analyze micro-expressions, eye movements, and subtle hand tremors to detect early signs of neurological disorders.",
      icon: Brain,
      color: "bg-neuroshield-blue"
    },
    {
      title: "Voice Pattern Recognition",
      description: "By analyzing speech patterns, rhythm variations, and vocal biomarkers, we can identify early indicators that may suggest neurological changes.",
      icon: Mic,
      color: "bg-neuroshield-purple"
    },
    {
      title: "Multimodal AI Fusion",
      description: "Our proprietary UFNet technology combines multiple data streams to provide a comprehensive assessment with higher accuracy than single-mode analysis.",
      icon: ChartBar,
      color: "bg-neuroshield-green"
    },
    {
      title: "Secure Data Privacy",
      description: "Your health data is encrypted and protected using medical-grade security protocols. We are HIPAA compliant and put your privacy first.",
      icon: Shield,
      color: "bg-neuroshield-orange"
    },
    {
      title: "Clinician Dashboard",
      description: "Healthcare professionals can monitor patient progress, review assessments, and receive alerts when significant changes are detected.",
      icon: UserCog,
      color: "bg-neuroshield-purple"
    },
    {
      title: "Longitudinal Tracking",
      description: "Monitor changes over time with personalized trend analysis that shows how your neurological indicators evolve month to month.",
      icon: LineChart,
      color: "bg-neuroshield-blue"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isAuthenticated}
        onLogin={() => {}}
        onLogout={logout}
      />
      <main className="flex-1 pt-20">
        <section className="py-16 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">NeuroShield AI Features</h1>
              <p className="text-lg max-w-3xl mx-auto">
                Our platform combines cutting-edge AI technology with neurological expertise to provide 
                early detection and monitoring capabilities unlike any other solution.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="neuroshield-card p-8 flex flex-col items-center text-center"
                >
                  <div className={`h-16 w-16 rounded-full ${feature.color} flex items-center justify-center text-white mb-6`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-20 bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">AI Model Specifications</h3>
                  <ul className="space-y-3 list-disc pl-5">
                    <li>120+ visual biomarkers including micro-expression analysis</li>
                    <li>85+ vocal biomarkers for speech pattern recognition</li>
                    <li>Custom-trained neural networks with 99.2% test accuracy</li>
                    <li>Real-time processing capabilities (under 5 seconds)</li>
                    <li>Continuous learning through federated model updates</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-4">Technical Requirements</h3>
                  <ul className="space-y-3 list-disc pl-5">
                    <li>Works on any modern web browser (Chrome, Firefox, Safari, Edge)</li>
                    <li>Requires camera and microphone access</li>
                    <li>Internet connection (minimum 1Mbps upload/download)</li>
                    <li>Mobile-friendly responsive design</li>
                    <li>WCAG 2.1 AA compliant for accessibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
