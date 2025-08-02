import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-serif font-semibold text-primary mb-2">Redefynn</h3>
          <p className="text-muted-foreground mb-4">P2P Funds Redefined</p>
          <p className="text-sm text-muted-foreground">
            Contact us: <a href="mailto:redefynnhq@gmail.com" className="text-primary hover:text-primary-glow transition-colors underline">redefynnhq@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;