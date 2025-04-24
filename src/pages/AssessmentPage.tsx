
import React from 'react';
import AssessmentTool from '@/components/assessment/AssessmentTool';
import { AlertTriangle } from 'lucide-react';

const AssessmentPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-2">Neurological Assessment</h1>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-center mb-6">
        <AlertTriangle className="text-yellow-500 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-yellow-800 mb-1 font-medium">
            This assessment requires camera and microphone access
          </p>
          <p className="text-xs text-yellow-700">
            Please ensure you grant permissions when prompted. All data is processed securely and only used for neurological analysis.
          </p>
        </div>
      </div>
      <AssessmentTool />
    </div>
  );
};

export default AssessmentPage;
