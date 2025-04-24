
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const mockData = {
  assessments: [
    { id: 1, date: '2025-03-18', riskScore: 0.15, status: 'Normal' },
    { id: 2, date: '2025-02-28', riskScore: 0.22, status: 'Normal' },
    { id: 3, date: '2025-02-10', riskScore: 0.18, status: 'Normal' },
  ],
  riskScore: 0.15,
  lastAssessment: '2025-03-18',
  trend: 'stable'
};

const Dashboard: React.FC = () => {
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your neurological health assessments and trends.</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-neuroshield-blue hover:bg-neuroshield-blue/90">
          Start New Assessment
        </Button>
      </div>
      
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
              {mockData.assessments.map((assessment) => (
                <div key={assessment.id} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full bg-muted transition-all duration-300 rounded-t"
                    style={{ 
                      height: `${assessment.riskScore * 100}%`,
                      backgroundColor: getRiskColor(assessment.riskScore)
                    }}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(assessment.date).split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Your trend appears to be 
                <span className="font-medium text-neuroshield-green"> stable</span>
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
              <Button variant="outline" className="w-full justify-start">Start Full Assessment</Button>
              <Button variant="outline" className="w-full justify-start">Motor Skills Test</Button>
              <Button variant="outline" className="w-full justify-start">Voice Analysis</Button>
              <Button variant="outline" className="w-full justify-start">View Detailed Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>Your assessment history from the past 3 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                <div>
                  <p className="font-medium">Assessment #{assessment.id}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(assessment.date)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Risk Score</p>
                    <p className="font-medium">{(assessment.riskScore * 100).toFixed(0)}%</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(assessment.riskScore)}`}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">View All History</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
