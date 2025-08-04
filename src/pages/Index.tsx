import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle, DollarSign, Clock, Users, TrendingUp, Building, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import redefynnLogo from "@/assets/Logo.jpeg";
import dentalHero from "@/assets/dental-hero.jpg";

const Index = () => {
  console.log("Index component is rendering");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('email_signups')
        .insert([{ email: email.trim(), source: 'homepage' }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already signed up!",
            description: "This email is already on our waitlist.",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll be in touch soon!",
          variant: "default",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-lg z-10 border-b">
        <div className="flex items-center gap-3">
          <img src={redefynnLogo} alt="Redefynn" className="h-8 w-auto" />
          <span className="text-2xl font-bold text-gray-900">Redefynn</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary">Features</a>
          <a href="#why-redefynn" className="text-sm font-medium text-gray-600 hover:text-primary">Why Redefynn</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
          <Button onClick={() => navigate('/get-started')}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative pt-28 pb-32 px-6 text-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={dentalHero} alt="Dental office background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              <span className="block">Funding Your Dental Practice,</span>
              <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mt-2">
                Redefined.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Connect directly with investors who understand dental practice financing.
              Skip the banks, secure capital faster, and focus on what matters: your patients.
            </p>
            <form onSubmit={handleEmailSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-3 px-4 text-base"
                required
              />
              <Button type="submit" disabled={isSubmitting} size="lg" className="px-8">
                {isSubmitting ? "Joining..." : "Join Waitlist"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
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
        <section id="why-redefynn" className="px-6 py-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-3">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <p className="text-4xl font-bold text-gray-900">50+</p>
                <p className="text-lg text-gray-600">Practitioners Funded</p>
              </div>
              <div className="space-y-3">
                <Clock className="h-12 w-12 text-primary mx-auto" />
                <p className="text-4xl font-bold text-gray-900">48 Hours</p>
                <p className="text-lg text-gray-600">Average Approval Time</p>
              </div>
              <div className="space-y-3">
                <Briefcase className="h-12 w-12 text-primary mx-auto" />
                <p className="text-4xl font-bold text-gray-900">Your Success</p>
                <p className="text-lg text-gray-600">Is Our Mission</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Redefynn?</h2>
              <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                We're not just a platform; we're your partner in growth. We've built Redefynn from the ground up to address the unique financial challenges faced by dental professionals.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Built for Dentists</h3>
                <p className="text-gray-600">
                  Our entire platform, from investor network to application process, is tailored specifically for the dental industry.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Radical Transparency</h3>
                <p className="text-gray-600">
                  No hidden fees. No confusing terms. We provide a clear, straightforward process so you always know where you stand.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Long-Term Partnerships</h3>
                <p className="text-gray-600">
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
            <form onSubmit={handleEmailSignup} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-3 px-4 text-base text-gray-800"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                variant="secondary"
                className="px-8"
              >
                {isSubmitting ? "Joining..." : "Join Waitlist"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={redefynnLogo} alt="Redefynn" className="h-7 w-auto" />
            <span className="font-semibold text-lg text-gray-800">Redefynn</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Redefynn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
