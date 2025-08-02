import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Stethoscope, 
  Eye, 
  Zap, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Layout from '@/components/Layout';

const LearnMore = () => {
  const navigate = useNavigate();

  const differentiators = [
    {
      icon: Users,
      title: "Peer-to-Peer Flexibility",
      description: "Connect directly with investors who understand healthcare, bypassing traditional banking limitations."
    },
    {
      icon: Stethoscope,
      title: "Dental Industry Expertise",
      description: "Our team specializes in dental practice financing with deep knowledge of your unique needs."
    },
    {
      icon: Eye,
      title: "Transparent Terms",
      description: "No hidden fees, clear terms, and straightforward communication throughout your journey."
    },
    {
      icon: Zap,
      title: "Fast Onboarding",
      description: "Get approved in days, not months. Our streamlined process gets you funded quickly."
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 fade-in">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-primary mb-6">
              Why Choose Redefynn?
            </h1>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              Unlike traditional lenders, we simplify access to startup capital through peer-powered funding—with 
              faster approvals, flexible terms, and a deep understanding of the dental industry.
            </p>
          </div>

          {/* Differentiators Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {differentiators.map((item, index) => (
              <Card 
                key={index} 
                className="bounce-in shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="floating mb-4" style={{ animationDelay: `${index * 0.2}s` }}>
                    <item.icon className="w-12 h-12 mx-auto text-accent" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Section */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 lg:p-12 mb-16 fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary mb-6">
                  Traditional vs. Redefynn
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Approval Time</h4>
                      <p className="text-muted-foreground">Days, not months of waiting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Industry Knowledge</h4>
                      <p className="text-muted-foreground">Dental-specific expertise and understanding</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Flexible Terms</h4>
                      <p className="text-muted-foreground">Customized to your practice's cash flow</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Personal Service</h4>
                      <p className="text-muted-foreground">Direct communication with decision makers</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="bg-card rounded-2xl p-8 shadow-elegant">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-4">
                    Ready to Experience the Difference?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join hundreds of dental professionals who've chosen a better way to finance their dreams.
                  </p>
                  <Button 
                    onClick={() => navigate('/get-started')} 
                    className="btn-accent group w-full"
                  >
                    Start Your Application
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center fade-in" style={{ animationDelay: '1s' }}>
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards owning your dream dental practice. Our application process is simple, 
              fast, and designed with busy dental professionals in mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/get-started')} 
                className="btn-hero group text-lg px-8 py-3"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="btn-outline text-lg px-8 py-3"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnMore;