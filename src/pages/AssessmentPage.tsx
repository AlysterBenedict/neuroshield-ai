
import React from 'react';
import AssessmentTool from '@/components/assessment/AssessmentTool';

const AssessmentPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Neurological Assessment</h1>
      <AssessmentTool />
    </div>
  );
};

export default AssessmentPage;
