import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Lock } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import redefynnLogo from '@/assets/redefynn-logo-visible.png';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await signIn(loginData.email, loginData.password);
    if (data?.user) {
      navigate('/dashboard');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      return;
    }
    const { data } = await signUp(signupData.email, signupData.password);
    if (data?.user) {
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full blur-2xl opacity-80 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-background via-card to-background rounded-3xl p-12 shadow-elegant border border-border/50 backdrop-blur-sm">
                <img 
                  src={redefynnLogo} 
                  alt="Redefynn Logo" 
                  className="w-40 h-40 mx-auto object-contain filter drop-shadow-2xl hover:scale-110 transition-all duration-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Redefynn
              </h1>
              <p className="text-xl text-muted-foreground font-medium tracking-wide">P2P Funds Redefined</p>
            </div>
          </div>

          {/* Login/Signup Tabs */}
          <Card className="fade-in shadow-elegant" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-center font-serif">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Access your dental practice financing journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        className="transition-all duration-300 focus:shadow-elegant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="transition-all duration-300 focus:shadow-elegant"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full btn-hero pulse-glow mt-6">
                      {loading ? 'Signing in...' : 'Continue to Dashboard'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                        className="transition-all duration-300 focus:shadow-elegant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        className="transition-all duration-300 focus:shadow-elegant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                        className="transition-all duration-300 focus:shadow-elegant"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full btn-hero pulse-glow mt-6">
                      {loading ? 'Creating account...' : 'Start Your Journey'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6 fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-muted-foreground">
              New to dental practice financing?{' '}
              <button 
                onClick={() => navigate('/')} 
                className="text-primary hover:text-primary-glow transition-colors underline"
              >
                Learn more about our solutions
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;