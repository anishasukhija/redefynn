import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, User, MapPin, DollarSign, Briefcase } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';

const GetStarted = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitApplication, loading } = useApplications();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    annualIncome: '',
    jobDescription: ''
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await submitApplication({
      name: formData.name,
      age: parseInt(formData.age),
      address: formData.address,
      annual_income: formData.annualIncome,
      job_description: formData.jobDescription,
    });

    if (data) {
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 typing-animation">
              Let's build your future practice.
            </h1>
            <p className="text-xl text-muted-foreground fade-in" style={{ animationDelay: '3.5s' }}>
              Tell us a bit about yourself to get started.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info Panel */}
            <div className="lg:col-span-1 fade-in" style={{ animationDelay: '4s' }}>
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="font-serif text-primary">Why We Ask</CardTitle>
                  <CardDescription>
                    This information helps us tailor the perfect financing solution for your dental practice.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Personal Details</h4>
                      <p className="text-xs text-muted-foreground">Helps us understand your profile</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Location</h4>
                      <p className="text-xs text-muted-foreground">Determines local market opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Financial Position</h4>
                      <p className="text-xs text-muted-foreground">Helps structure your funding terms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Experience</h4>
                      <p className="text-xs text-muted-foreground">Informs our support strategy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="font-serif text-primary">Application Form</CardTitle>
                  <CardDescription>
                    All information is kept strictly confidential and secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="slide-in-right" style={{ animationDelay: '4.2s' }}>
                        <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Dr. Jane Smith"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="mt-2 transition-all duration-300 focus:shadow-elegant"
                        />
                      </div>

                      <div className="slide-in-right" style={{ animationDelay: '4.4s' }}>
                        <Label htmlFor="age" className="text-base font-medium">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="32"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          required
                          min="18"
                          max="100"
                          className="mt-2 transition-all duration-300 focus:shadow-elegant"
                        />
                      </div>
                    </div>

                    <div className="slide-in-right" style={{ animationDelay: '4.6s' }}>
                      <Label htmlFor="address" className="text-base font-medium">Address *</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street, City, State, ZIP"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                        className="mt-2 transition-all duration-300 focus:shadow-elegant"
                      />
                    </div>

                    <div className="slide-in-right" style={{ animationDelay: '4.8s' }}>
                      <Label htmlFor="annualIncome" className="text-base font-medium">Annual Income *</Label>
                      <Input
                        id="annualIncome"
                        placeholder="$150,000"
                        value={formData.annualIncome}
                        onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                        required
                        className="mt-2 transition-all duration-300 focus:shadow-elegant"
                      />
                    </div>

                    <div className="slide-in-right" style={{ animationDelay: '5s' }}>
                      <Label htmlFor="jobDescription" className="text-base font-medium">
                        Job Description & Experience *
                      </Label>
                      <Textarea
                        id="jobDescription"
                        placeholder="Describe your current role, experience in dentistry, and your goals for practice ownership..."
                        value={formData.jobDescription}
                        onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                        required
                        rows={4}
                        className="mt-2 transition-all duration-300 focus:shadow-elegant resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <Button
                        type="button"
                        onClick={() => navigate('/learn-more')}
                        variant="outline"
                        className="btn-outline group"
                      >
                        <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={loading}
                        className="btn-hero group flex-1 pulse-glow"
                      >
                        {loading ? 'Submitting...' : 'Submit Application'}
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-12 fade-in" style={{ animationDelay: '5.5s' }}>
            <p className="text-sm text-muted-foreground mb-4">
              🔒 Your information is encrypted and secure. We never share your data with third parties.
            </p>
            <div className="flex justify-center items-center space-x-8 text-xs text-muted-foreground">
              <span>✓ HIPAA Compliant</span>
              <span>✓ Bank-Level Security</span>
              <span>✓ 48hr Response Time</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GetStarted;