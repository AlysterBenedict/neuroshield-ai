
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// This would normally be fetched from the authentication context
// For this example, we'll use a mock token
const MOCK_AUTH_TOKEN = 'Bearer mock_jwt_token';

enum AssessmentStage {
  INTRO = 'intro',
  PREP = 'prep',
  RECORDING = 'recording',
  PROCESSING = 'processing',
  RESULTS = 'results'
}

interface AssessmentResult {
  riskScore: number;
  riskClass: string;
  motorControl: string;
  speechPattern: string;
  facialExpression: string;
}

const AssessmentTool: React.FC = () => {
  const [stage, setStage] = useState<AssessmentStage>(AssessmentStage.INTRO);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();
  
  // Request camera and microphone permissions
  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      toast({
        title: "Permission Error",
        description: "Please allow camera and microphone access to continue",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  // Start the assessment recording process
  const startRecording = async () => {
    try {
      videoChunksRef.current = [];
      audioChunksRef.current = [];
      
      // Get media stream
      const stream = await setupMedia();
      
      // Setup media recorder for video
      const videoTrack = stream.getVideoTracks()[0];
      const videoStream = new MediaStream([videoTrack]);
      const videoRecorder = new MediaRecorder(videoStream);
      
      videoRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };
      
      // Setup media recorder for audio
      const audioTrack = stream.getAudioTracks()[0];
      const audioStream = new MediaStream([audioTrack]);
      const audioRecorder = new MediaRecorder(audioStream);
      
      audioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Start recording
      videoRecorder.start();
      audioRecorder.start();
      mediaRecorderRef.current = videoRecorder;
      
      setStage(AssessmentStage.RECORDING);
      setProgress(0);
      
      // Track progress for 30 seconds
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 3.33; // 30 seconds = 100%
          
          if (newProgress >= 100) {
            clearInterval(interval);
            videoRecorder.stop();
            audioRecorder.stop();
            
            // Process the recording after a short delay
            setTimeout(() => {
              processRecording();
            }, 1000);
            
            return 100;
          }
          
          return newProgress;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check your camera and microphone permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Upload the recorded video and audio to the backend
  const processRecording = async () => {
    setStage(AssessmentStage.PROCESSING);
    
    try {
      const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('video', videoBlob, 'recording.webm');
      formData.append('audio', audioBlob, 'audio.webm');
      
      // Upload to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': MOCK_AUTH_TOKEN
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process results
      const sessionData = data.session;
      const fusionOutput = sessionData.fusionOutput;
      
      setResult({
        riskScore: sessionData.riskScore,
        riskClass: fusionOutput.riskClass || 'Low Risk',
        motorControl: sessionData.riskScore < 0.3 ? 'Normal' : 'Abnormal',
        speechPattern: sessionData.riskScore < 0.3 ? 'Normal' : 'Abnormal',
        facialExpression: sessionData.riskScore < 0.3 ? 'Normal' : 'Abnormal'
      });
      
      // Stop media tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Show results
      setStage(AssessmentStage.RESULTS);
      
    } catch (error) {
      console.error('Processing error:', error);
      setError('An error occurred while processing your assessment. Please try again.');
      
      toast({
        title: "Processing Error",
        description: "Failed to process your assessment. Please try again.",
        variant: "destructive"
      });
      
      // Return to intro stage on error
      setStage(AssessmentStage.INTRO);
    }
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
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover rounded-lg"
                autoPlay 
                muted 
                playsInline
              />
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
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover rounded-lg"
                autoPlay 
                muted 
                playsInline
              />
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Recording</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white text-center">
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
        
        {stage === AssessmentStage.RESULTS && result && (
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
                <span className={`font-semibold ${
                  result.riskScore < 0.3 ? "text-green-700" : 
                  result.riskScore < 0.6 ? "text-yellow-700" : "text-red-700"
                }`}>
                  {Math.round(result.riskScore * 100)}% ({result.riskClass})
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span>Motor Control Analysis</span>
                  <span className={`font-medium ${
                    result.motorControl === 'Normal' ? "text-green-700" : "text-yellow-700"
                  }`}>
                    {result.motorControl}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {result.motorControl === 'Normal' 
                    ? 'No significant tremors or movement abnormalities detected' 
                    : 'Potential tremors or movement patterns detected'}
                </p>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span>Speech Pattern Analysis</span>
                  <span className={`font-medium ${
                    result.speechPattern === 'Normal' ? "text-green-700" : "text-yellow-700"
                  }`}>
                    {result.speechPattern}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {result.speechPattern === 'Normal'
                    ? 'Speech rhythm and pronunciation within expected parameters'
                    : 'Speech patterns show potential irregularities'}
                </p>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <span>Facial Expression Analysis</span>
                  <span className={`font-medium ${
                    result.facialExpression === 'Normal' ? "text-green-700" : "text-yellow-700"
                  }`}>
                    {result.facialExpression}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {result.facialExpression === 'Normal'
                    ? 'Facial symmetry and micro-expressions indicate normal neural function'
                    : 'Facial expressions show potential asymmetry or irregularities'}
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
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentTool;
