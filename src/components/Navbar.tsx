
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn = false, 
  onLogin = () => {}, 
  onLogout = () => {} 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <nav className="w-full py-4 px-6 border-b border-border bg-background/95 backdrop-blur-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full neuroshield-gradient flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="font-semibold text-lg text-foreground">NeuroShield AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/features" className="text-foreground/80 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" className="border-neuroshield-blue text-neuroshield-blue hover:bg-neuroshield-blue/10">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className="text-neuroshield-gray hover:bg-neuroshield-gray/10"
              >
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="border-neuroshield-blue text-neuroshield-blue hover:bg-neuroshield-blue/10"
              >
                Log in
              </Button>
              <Button
                className="bg-neuroshield-blue text-white hover:bg-neuroshield-blue/90"
                onClick={handleSignUp}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
