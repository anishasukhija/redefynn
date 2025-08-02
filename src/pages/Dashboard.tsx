import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, LogOut, FileText, Clock, CheckCircle, XCircle, User, MapPin, BarChart3 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useApplications';
import { useApplicationStats } from '@/hooks/useApplicationStats';
import { useProfile } from '@/hooks/useProfile';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { applications, loading: applicationsLoading } = useApplications();
  const { stats, loading: statsLoading } = useApplicationStats();
  const { isAdmin, loading: profileLoading } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4" />;
      case 'reviewing':
        return <FileText className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (applicationsLoading || statsLoading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 fade-in">
            <div>
              <h1 className="text-4xl font-serif font-bold text-primary mb-2">
                Welcome back
              </h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                {user?.email}
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="btn-outline group"
            >
              <LogOut className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-elegant fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="font-serif text-primary">Quick Actions</CardTitle>
                <CardDescription>
                  Get started with your dental practice financing journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/get-started')}
                    className="w-full btn-hero group"
                  >
                    <Plus className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Submit New Application
                  </Button>
                  <Button
                    onClick={() => navigate('/learn-more')}
                    variant="outline"
                    className="w-full btn-outline"
                  >
                    Learn More About Our Services
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="font-serif text-primary flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {isAdmin ? 'All Applications Summary' : 'Application Statistics'}
                </CardTitle>
                <CardDescription>
                  {isAdmin ? 'Overview of all submitted applications' : 'Public application statistics by location'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Applications</span>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {applications.length}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {applications.filter(app => app.status === 'submitted').length}
                        </div>
                        <div className="text-muted-foreground">Submitted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {applications.filter(app => app.status === 'approved').length}
                        </div>
                        <div className="text-muted-foreground">Approved</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No application statistics available</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Applications Submitted</span>
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            {stats.reduce((sum, stat) => sum + stat.application_count, 0)}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {stats.map((stat, index) => (
                            <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {stat.city}, {stat.state}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {stat.application_count} {stat.application_count === 1 ? 'application' : 'applications'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Applications List - Only show for admins or user's own applications */}
          {isAdmin ? (
            <Card className="shadow-elegant fade-in" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="font-serif text-primary">All Applications (Admin View)</CardTitle>
                <CardDescription>
                  View and manage all submitted funding applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      No applications submitted yet
                    </h3>
                    <p className="text-muted-foreground">
                      Applications will appear here as users submit them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application, index) => (
                      <div
                        key={application.id}
                        className="border rounded-lg p-4 slide-in-right"
                        style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{application.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Submitted on{' '}
                              {application.created_at 
                                ? new Date(application.created_at).toLocaleDateString()
                                : 'Unknown date'
                              }
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(application.status || 'submitted')} flex items-center gap-1`}>
                            {getStatusIcon(application.status || 'submitted')}
                            {application.status || 'submitted'}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Age:</span>
                            <span className="ml-2 font-medium">{application.age}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Income:</span>
                            <span className="ml-2 font-medium">{application.annual_income}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Job:</span>
                            <span className="ml-2 font-medium">{application.job_description}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <span className="ml-2 font-medium">
                              {application.address.split(',').slice(-2).join(',').trim()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-elegant fade-in" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="font-serif text-primary">Your Applications</CardTitle>
                <CardDescription>
                  Track the status of your submitted funding applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      No applications yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Start your journey by submitting your first application
                    </p>
                    <Button
                      onClick={() => navigate('/get-started')}
                      className="btn-hero"
                    >
                      Submit Application
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application, index) => (
                      <div
                        key={application.id}
                        className="border rounded-lg p-4 slide-in-right"
                        style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{application.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Submitted on{' '}
                              {application.created_at 
                                ? new Date(application.created_at).toLocaleDateString()
                                : 'Unknown date'
                              }
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(application.status || 'submitted')} flex items-center gap-1`}>
                            {getStatusIcon(application.status || 'submitted')}
                            {application.status || 'submitted'}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Age:</span>
                            <span className="ml-2 font-medium">{application.age}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Income:</span>
                            <span className="ml-2 font-medium">{application.annual_income}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <span className="ml-2 font-medium">
                              {application.address.split(',').slice(-2).join(',').trim()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;