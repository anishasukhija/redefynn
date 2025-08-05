import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, DollarSign, Clock, Users, TrendingUp, Building, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import redefynnLogo from "@/assets/Logo.jpeg";
import dentalHero from "@/assets/dental-hero.jpg";

const Index = () => {
  console.log("Index component is rendering");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-lg z-10 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={redefynnLogo} alt="Redefynn" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-foreground">Redefynn</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#why-redefynn"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('why-redefynn')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            Why Redefynn
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            Features
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/welcome')}>Get Started</Button>
        </div>
      </header>      {/* Hero Section */}
      <main>
        <section className="relative pt-28 pb-32 px-6 text-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={dentalHero} alt="Dental office background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>
          <div className="relative max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              <span className="block">Funding Your Dental Practice,</span>
              <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mt-2">
                Redefined.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
              Connect directly with investors who understand dental practice financing.
              Skip the banks, secure capital faster, and focus on what matters: your patients.
            </p>
            <div className="flex justify-center">
              <Button size="lg" onClick={() => navigate('/welcome')} className="px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No credit checks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Fast approval</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Competitive rates</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="why-redefynn" className="px-6 py-20 bg-card">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-3">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <p className="text-4xl font-bold text-foreground">40+</p>
                <p className="text-lg text-muted-foreground">Practitioners Registered</p>
              </div>
              <div className="space-y-3">
                <Clock className="h-12 w-12 text-primary mx-auto" />
                <p className="text-4xl font-bold text-foreground">48 Hours</p>
                <p className="text-lg text-muted-foreground">Average Approval Time</p>
              </div>
              <div className="space-y-3">
                <Briefcase className="h-12 w-12 text-primary mx-auto" />
                <p className="text-4xl font-bold text-foreground">Your Success</p>
                <p className="text-lg text-muted-foreground">Is Our Mission</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose Redefynn?</h2>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                We're not just a platform; we're your partner in growth. We've built Redefynn from the ground up to address the unique financial challenges faced by dental professionals.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Built for Dentists</h3>
                <p className="text-muted-foreground">
                  Our entire platform, from investor network to application process, is tailored specifically for the dental industry.
                </p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Radical Transparency</h3>
                <p className="text-muted-foreground">
                  No hidden fees. No confusing terms. We provide a clear, straightforward process so you always know where you stand.
                </p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Long-Term Partnerships</h3>
                <p className="text-muted-foreground">
                  We're invested in your success beyond a single transaction. We provide resources and a community to help your practice thrive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center py-20 px-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Fund Your Practice's Growth?
            </h2>
            <p className="text-xl opacity-90 mt-4 max-w-2xl mx-auto">
              Join hundreds of dental practices that have secured funding through our platform. Get started today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => navigate('/welcome')} variant="secondary" className="px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={redefynnLogo} alt="Redefynn" className="h-7 w-auto" />
            <span className="font-semibold text-lg text-foreground">Redefynn</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Redefynn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
