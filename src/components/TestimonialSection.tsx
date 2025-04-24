
import React from 'react';
import { Card } from '@/components/ui/card';

const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      quote: "NeuroShield helped us detect my father's early signs of Parkinson's disease a full year before traditional clinical symptoms appeared.",
      author: "Sarah J.",
      role: "Family Caregiver"
    },
    {
      quote: "As a neurologist, I'm impressed by the accuracy of NeuroShield's assessments. It's a valuable screening tool in my practice.",
      author: "Dr. Michael Chen",
      role: "Neurologist, NYU Medical Center"
    },
    {
      quote: "The regular monitoring feature helps me track my condition and have more productive conversations with my healthcare team.",
      author: "Robert T.",
      role: "Living with Early-Stage Alzheimer's"
    }
  ];

  return (
    <div className="py-16 bg-neuroshield-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">What People Are Saying</h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            NeuroShield is making a difference in people's lives by enabling earlier detection and better management.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="p-6 flex flex-col animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-4xl text-neuroshield-blue mb-4">"</div>
              <p className="text-foreground/90 italic mb-6 flex-grow">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-foreground/70">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
