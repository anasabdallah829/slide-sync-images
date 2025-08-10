import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CheckCircle, FileImage, Presentation, FolderOpen } from 'lucide-react';

interface ProcessingStep {
  id: string;
  label: string;
  completed: boolean;
  progress: number;
}

interface ProcessingCardProps {
  steps: ProcessingStep[];
  currentStep: number;
  totalFolders: number;
  processedFolders: number;
  className?: string;
}

export const ProcessingCard: React.FC<ProcessingCardProps> = ({
  steps,
  currentStep,
  totalFolders,
  processedFolders,
  className
}) => {
  const icons = [
    <FileImage className="h-5 w-5" />,
    <FolderOpen className="h-5 w-5" />,
    <Presentation className="h-5 w-5" />,
    <CheckCircle className="h-5 w-5" />
  ];

  return (
    <Card className={`${className} bg-gradient-card border-0 shadow-medium`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-foreground">
          🔄 جاري المعالجة...
        </CardTitle>
        <p className="text-muted-foreground">
          تمت معالجة {processedFolders} من {totalFolders} مجلد
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ProgressBar
          value={totalFolders > 0 ? (processedFolders / totalFolders) * 100 : 0}
          label="التقدم الإجمالي"
          variant="primary"
        />
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 space-x-reverse p-3 rounded-lg transition-all duration-300 ${
                index === currentStep
                  ? 'bg-primary/10 border border-primary/20'
                  : step.completed
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-muted/50'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-primary text-white animate-pulse-soft'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  icons[index] || <span>{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${
                  step.completed ? 'text-green-700' : 
                  index === currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </p>
                
                {index === currentStep && step.progress > 0 && (
                  <div className="mt-2">
                    <ProgressBar
                      value={step.progress}
                      variant="secondary"
                      showPercentage={false}
                      className="h-1"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};