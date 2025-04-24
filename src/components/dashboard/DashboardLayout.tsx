
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 px-6">
        <div className="h-16 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full neuroshield-gradient flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-semibold text-lg text-foreground">NeuroShield AI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-neuroshield-blue text-neuroshield-blue hover:bg-neuroshield-blue/10">
              New Assessment
            </Button>
            <div className="h-8 w-8 rounded-full bg-neuroshield-purple text-white flex items-center justify-center font-medium">
              JD
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="w-64 border-r border-border hidden md:block pt-6">
          <div className="px-4 py-2">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">DASHBOARD</h2>
            <nav className="space-y-1">
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground"
              >
                <span>Overview</span>
              </Link>
              <Link 
                to="/dashboard/history"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground"
              >
                <span>Assessment History</span>
              </Link>
              <Link 
                to="/dashboard/reports"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground"
              >
                <span>Reports</span>
              </Link>
              <Link 
                to="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground"
              >
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
