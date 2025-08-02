import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import redefynnLogo from '@/assets/redefynn-logo-minimal.png';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show header on welcome page as it has its own logo treatment
  const isWelcomePage = location.pathname === '/welcome';

  return (
    <div className="min-h-screen bg-background">
      {!isWelcomePage && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur-lg opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-background via-card to-background rounded-xl p-3 shadow-elegant border border-border/50">
                    <img 
                      src={redefynnLogo} 
                      alt="Redefynn Logo" 
                      className="w-12 h-12 object-contain filter drop-shadow-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Redefynn
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium tracking-wide">P2P Funds Redefined</p>
                </div>
              </button>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/')}
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => navigate('/learn-more')}
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/learn-more' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Learn More
                </button>
                <button 
                  onClick={() => navigate('/welcome')}
                  className="btn-hero text-sm px-4 py-2"
                >
                  Sign In
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}
      
      <main className={!isWelcomePage ? 'pt-20' : ''}>
        {children}
      </main>
      
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-br from-background via-card to-background rounded-xl p-3 shadow-elegant border border-border/30">
                <img 
                  src={redefynnLogo} 
                  alt="Redefynn Logo" 
                  className="w-10 h-10 object-contain filter drop-shadow-lg"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-semibold text-primary">Redefynn</h3>
              <p className="text-base text-muted-foreground">P2P Funds Redefined</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Contact us: <a href="mailto:redefynnhq@gmail.com" className="text-primary hover:text-primary-glow transition-colors underline">redefynnhq@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;