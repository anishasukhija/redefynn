import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { applications, loading } = useApplications(user?.id);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h1 className="text-4xl font-serif font-bold text-primary mb-2">
                Welcome back!
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your dental practice financing journey
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Button 
                onClick={() => navigate('/get-started')}
                className="btn-hero"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
              <Button 
                onClick={signOut}
                variant="outline"
                className="btn-outline"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Applications Section */}
          <div className="grid gap-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="font-serif text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Applications
                </CardTitle>
                <CardDescription>
                  Track the status of your dental practice funding applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Ready to start your dental practice financing journey?
                    </p>
                    <Button onClick={() => navigate('/get-started')} className="btn-hero">
                      Submit Your First Application
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div 
                        key={application.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{application.name}</h3>
                              <Badge className={getStatusColor(application.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(application.status)}
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </span>
                              </Badge>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <p>Age: {application.age}</p>
                              <p>Income: ${application.annual_income?.toLocaleString()}</p>
                              <p className="sm:col-span-2">Address: {application.address}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>Submitted</p>
                            <p>{new Date(application.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-elegant hover:shadow-glow transition-shadow cursor-pointer" 
                    onClick={() => navigate('/learn-more')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Learn More</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover our P2P funding advantages
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant hover:shadow-glow transition-shadow cursor-pointer"
                    onClick={() => navigate('/get-started')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Apply Now</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a new funding application
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-elegant hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help with your application
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;