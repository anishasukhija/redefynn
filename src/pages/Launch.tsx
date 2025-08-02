import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import Layout from '@/components/Layout';
import heroImage from '@/assets/dental-hero.jpg';

const Launch = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with parallax effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-background/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="fade-in">
                <h1 className="text-5xl lg:text-7xl font-serif font-bold text-primary leading-tight">
                  P2P Funds
                  <span className="block text-accent">Redefined</span>
                </h1>
              </div>
              
              <div className="fade-in" style={{ animationDelay: '0.3s' }}>
                <p className="text-xl lg:text-2xl text-foreground leading-relaxed">
                  We're throwing friction out the window and accelerating your journey to your own 
                  <span className="font-semibold text-primary"> dream dental practice.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 fade-in" style={{ animationDelay: '0.6s' }}>
                <Button 
                  onClick={() => navigate('/get-started')} 
                  className="btn-hero group text-lg px-8 py-6"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  onClick={() => navigate('/learn-more')} 
                  className="btn-outline text-lg px-8 py-6 group"
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Learn More
                </Button>
              </div>

              <div className="fade-in" style={{ animationDelay: '0.9s' }}>
                <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div>Practices Funded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">$50M+</div>
                    <div>Capital Deployed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">48hrs</div>
                    <div>Avg. Approval</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="slide-in-left" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Modern dental practice with state-of-the-art equipment" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Navigation hint */}
          <div className="text-center mt-16 fade-in" style={{ animationDelay: '1.2s' }}>
            <div className="inline-flex items-center text-muted-foreground">
              <span className="mr-2">Ready to transform your practice?</span>
              <div className="w-8 h-0.5 bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Launch;