
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

enum AssessmentStage {
  INTRO = 'intro',
  PREP = 'prep',
  RECORDING = 'recording',
  PROCESSING = 'processing',
  RESULTS = 'results'
}

const AssessmentTool: React.FC = () => {
  const [stage, setStage] = useState<AssessmentStage>(AssessmentStage.INTRO);
  const [progress, setProgress] = useState(0);
  
  // Simulate recording progress
  const startRecording = () => {
    setStage(AssessmentStage.RECORDING);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage(AssessmentStage.PROCESSING);
          setTimeout(() => setStage(AssessmentStage.RESULTS), 3000);
          return 100;
        }
        return prev + 3.33; // 30 seconds = 100%
      });
    }, 1000);
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Neurological Assessment</CardTitle>
        <CardDescription className="text-center">
          {stage === AssessmentStage.INTRO && "Complete a comprehensive neurological screening in under 2 minutes"}
          {stage === AssessmentStage.PREP && "Prepare for your assessment"}
          {stage === AssessmentStage.RECORDING && "Recording in progress"}
          {stage === AssessmentStage.PROCESSING && "Analyzing your results"}
          {stage === AssessmentStage.RESULTS && "Assessment complete"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {stage === AssessmentStage.INTRO && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">What to expect</h3>
              <p className="text-muted-foreground">
                This assessment will use your device's camera and microphone to analyze subtle 
                facial expressions, hand movements, and voice patterns. The entire process takes 
                approximately 30 seconds.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Instructions</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Find a well-lit, quiet environment</li>
                <li>Position your face clearly in the camera frame</li>
                <li>When prompted, follow the on-screen instructions</li>
                <li>Speak clearly when asked to read the provided text</li>
              </ul>
            </div>
            
            <div className="text-center pt-4">
              <Button
                className="bg-neuroshield-blue hover:bg-neuroshield-blue/90"
                onClick={() => setStage(AssessmentStage.PREP)}
              >
                Begin Assessment
              </Button>
            </div>
          </div>
        )}
        
        {stage === AssessmentStage.PREP && (
          <div className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-lg font-medium mb-2">Camera Preview</p>
                <p className="text-muted-foreground">
                  Position your face clearly in the center of the frame
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preparation Checklist</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">✓</div>
                  <span>Good lighting detected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">✓</div>
                  <span>Microphone working properly</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">✓</div>
                  <span>Face positioned correctly</span>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <Button
                className="bg-neuroshield-blue hover:bg-neuroshield-blue/90"
                onClick={startRecording}
              >
                Start Recording
              </Button>
            </div>
          </div>
        )}
        
        {stage === AssessmentStage.RECORDING && (
          <div className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Recording</span>
                </div>
              </div>
              <div className="text-center p-6">
                <p className="text-lg font-medium mb-2">Please read the following text aloud:</p>
                <p className="text-xl">
                  "The rainbow appears after a storm when the sun shines through the rain."
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <Progress value={progress} />
              <p className="text-xs text-center text-muted-foreground">
                Please follow the on-screen instructions until the recording is complete
              </p>
            </div>
          </div>
        )}
        
        {stage === AssessmentStage.PROCESSING && (
          <div className="py-12 text-center space-y-6">
            <div className="mx-auto w-16 h-16 border-4 border-neuroshield-blue border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="font-medium">Analyzing results</p>
              <p className="text-sm text-muted-foreground">Our AI is processing your assessment data</p>
            </div>
          </div>
        )}
        
        {stage === AssessmentStage.RESULTS && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-green-700">Assessment Complete</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your neurological health assessment has been successfully processed
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Risk Assessment</h4>
              <div className="flex justify-between items-center">
                <span>Overall Risk Score:</span>
                <span className="font-semibold text-green-700">15% (Low Risk)</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span>Motor Control Analysis</span>
                  <span className="font-medium text-green-700">Normal</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  No significant tremors or movement abnormalities detected
                </p>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span>Speech Pattern Analysis</span>
                  <span className="font-medium text-green-700">Normal</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Speech rhythm and pronunciation within expected parameters
                </p>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span>Facial Expression Analysis</span>
                  <span className="font-medium text-green-700">Normal</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Facial symmetry and micro-expressions indicate normal neural function
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4 flex flex-col md:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setStage(AssessmentStage.INTRO)}
              >
                Start New Assessment
              </Button>
              <Button
                className="bg-neuroshield-blue hover:bg-neuroshield-blue/90"
              >
                View Detailed Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentTool;
