
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Mock auth token (in a real app, this would come from auth context)
const MOCK_AUTH_TOKEN = 'Bearer mock_jwt_token';

// Session type definition
interface Session {
  id: string;
  recordedAt: string;
  riskScore: number;
  status?: string;
}

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch sessions from the API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sessions`, {
          headers: {
            'Authorization': MOCK_AUTH_TOKEN
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        
        const data = await response.json();
        
        // Transform data to match our component needs
        const formattedSessions = data.map((session: any) => ({
          id: session.id,
          recordedAt: session.recordedAt,
          riskScore: session.riskScore,
          status: getRiskStatus(session.riskScore)
        }));
        
        setSessions(formattedSessions);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Unable to load your assessment history');
        toast({
          title: 'Error',
          description: 'Failed to load your assessment history',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [toast]);
  
  const getRiskStatus = (score: number): string => {
    if (score < 0.3) return 'Normal';
    if (score < 0.6) return 'Moderate';
    return 'High';
  };

  const getRiskColor = (score: number) => {
    if (score < 0.3) return 'bg-green-500';
    if (score < 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStartAssessment = () => {
    navigate('/dashboard/assessment');
  };
  
  // If we have no sessions data, show a mock for UI purposes
  const mockData = {
    riskScore: sessions.length > 0 ? sessions[0].riskScore : 0.15,
    lastAssessment: sessions.length > 0 ? sessions[0].recordedAt : new Date().toISOString(),
    trend: 'stable'
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your neurological health assessments and trends.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-neuroshield-blue hover:bg-neuroshield-blue/90"
          onClick={handleStartAssessment}
        >
          Start New Assessment
        </Button>
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center pt-2">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <Skeleton className="h-4 w-36 mt-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Risk Score</CardTitle>
              <CardDescription>Based on your latest assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative h-32 w-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="10" 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={mockData.riskScore < 0.3 ? "#22c55e" : mockData.riskScore < 0.6 ? "#eab308" : "#ef4444"} 
                      strokeWidth="10" 
                      strokeDasharray="282.7"
                      strokeDashoffset={282.7 * (1 - mockData.riskScore)}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{(mockData.riskScore * 100).toFixed(0)}%</span>
                    <span className={`text-sm font-medium ${
                      mockData.riskScore < 0.3 ? "text-green-600" : 
                      mockData.riskScore < 0.6 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {mockData.riskScore < 0.3 ? "Low Risk" : 
                       mockData.riskScore < 0.6 ? "Moderate Risk" : "High Risk"}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Last assessed on {formatDate(mockData.lastAssessment)}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Risk Trend</CardTitle>
              <CardDescription>Your risk score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[150px] flex items-end justify-between gap-2">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                      className="w-full bg-muted transition-all duration-300 rounded-t"
                      style={{ 
                        height: `${session.riskScore * 100}%`,
                        backgroundColor: getRiskColor(session.riskScore)
                      }}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(session.recordedAt).split(' ')[0]}
                    </span>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="w-full flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No assessment data yet</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {sessions.length > 0 ? (
                    <>
                      Your trend appears to be 
                      <span className="font-medium text-neuroshield-green"> {mockData.trend}</span>
                    </>
                  ) : (
                    'Complete your first assessment to see trends'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common assessment tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleStartAssessment}
                >
                  Start Full Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start">Motor Skills Test</Button>
                <Button variant="outline" className="w-full justify-start">Voice Analysis</Button>
                <Button variant="outline" className="w-full justify-start">View Detailed Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>Your assessment history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <div>
                    <p className="font-medium">Assessment #{session.id.substring(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(session.recordedAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Risk Score</p>
                      <p className="font-medium">{(session.riskScore * 100).toFixed(0)}%</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(session.riskScore)}`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">No assessments yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleStartAssessment}
              >
                Complete Your First Assessment
              </Button>
            </div>
          )}
          
          {sessions.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline">View All History</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
