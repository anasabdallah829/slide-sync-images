import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { ProcessingCard } from '@/components/ProcessingCard';
import { useToast } from '@/hooks/use-toast';
import { Presentation, Archive, Sparkles, Download, CheckCircle, ArrowRight, Upload } from 'lucide-react';

const Index = () => {
  const [pptxFile, setPptxFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([
    { id: 'extract', label: 'استخراج الصور من ملف ZIP', completed: false, progress: 0 },
    { id: 'analyze', label: 'تحليل مجلدات الصور', completed: false, progress: 0 },
    { id: 'process', label: 'معالجة شرائح PowerPoint', completed: false, progress: 0 },
    { id: 'complete', label: 'إنهاء المعالجة وإعداد التحميل', completed: false, progress: 0 }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalFolders, setTotalFolders] = useState(0);
  const [processedFolders, setProcessedFolders] = useState(0);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!pptxFile || !zipFile) {
      toast({
        title: "⚠ ملفات ناقصة",
        description: "يرجى رفع كل من ملف PowerPoint وملف ZIP",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // محاكاة عملية المعالجة
      await simulateProcessing();
      
      toast({
        title: "✅ تمت المعالجة بنجاح",
        description: "تم إنشاء العرض التقديمي الجديد بنجاح",
      });
    } catch (error) {
      toast({
        title: "❌ خطأ في المعالجة",
        description: "حدث خطأ أثناء معالجة الملفات",
        variant: "destructive"
      });
    }
  };

  const simulateProcessing = async () => {
    // محاكاة استخراج ZIP
    setCurrentStep(0);
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStepProgress(0, 100, true);
    
    // محاكاة تحليل المجلدات
    setCurrentStep(1);
    setTotalFolders(5);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepProgress(1, 100, true);
    
    // محاكاة معالجة الشرائح
    setCurrentStep(2);
    for (let i = 1; i <= 5; i++) {
      setProcessedFolders(i);
      updateStepProgress(2, (i / 5) * 100, false);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    updateStepProgress(2, 100, true);
    
    // إنهاء المعالجة
    setCurrentStep(3);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepProgress(3, 100, true);
    
    setIsProcessing(false);
  };

  const updateStepProgress = (stepIndex: number, progress: number, completed: boolean) => {
    setProcessingSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, progress, completed } : step
    ));
  };

  const resetForm = () => {
    setPptxFile(null);
    setZipFile(null);
    setIsProcessing(false);
    setCurrentStep(0);
    setTotalFolders(0);
    setProcessedFolders(0);
    setProcessingSteps(prev => prev.map(step => ({ ...step, completed: false, progress: 0 })));
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-large">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            🎨 معالج عروض PowerPoint
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            قم برفع ملف PowerPoint وملف ZIP يحتوي على مجلدات الصور، وسنقوم بإنشاء شرائح جديدة لكل مجلد تلقائياً
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {!isProcessing ? (
            <>
              {/* Upload Section */}
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-large">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                    <Upload className="h-6 w-6" />
                    رفع الملفات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                      accept=".pptx"
                      onFileSelect={setPptxFile}
                      placeholder="ملف PowerPoint (.pptx)"
                      icon={<Presentation className="h-8 w-8 text-white" />}
                    />
                    
                    <FileUpload
                      accept=".zip"
                      onFileSelect={setZipFile}
                      placeholder="ملف ZIP (مجلدات الصور)"
                      icon={<Archive className="h-8 w-8 text-white" />}
                    />
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleProcess}
                      disabled={!pptxFile || !zipFile}
                      className="bg-gradient-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full text-lg font-medium shadow-medium hover:shadow-large transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🚀 بدء المعالجة
                      <ArrowRight className="mr-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Presentation className="h-8 w-8" />,
                    title: "معالجة تلقائية",
                    description: "يتم إنشاء شرائح جديدة لكل مجلد صور تلقائياً"
                  },
                  {
                    icon: <Archive className="h-8 w-8" />,
                    title: "مجلدات متعددة",
                    description: "دعم معالجة عدة مجلدات في ملف ZIP واحد"
                  },
                  {
                    icon: <CheckCircle className="h-8 w-8" />,
                    title: "جودة عالية",
                    description: "الحفاظ على جودة الصور والتنسيق الأصلي"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105">
                    <CardContent className="text-center p-6">
                      <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            /* Processing Section */
            <div className="space-y-6">
              <ProcessingCard
                steps={processingSteps}
                currentStep={currentStep}
                totalFolders={totalFolders}
                processedFolders={processedFolders}
                className="max-w-2xl mx-auto"
              />
              
              {processingSteps.every(step => step.completed) && (
                <Card className="bg-green-50 border-green-200 max-w-2xl mx-auto">
                  <CardContent className="text-center p-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                      ✅ تمت المعالجة بنجاح!
                    </h3>
                    <p className="text-green-600 mb-4">
                      تم إنشاء عرض PowerPoint جديد مع {totalFolders} شرائح
                    </p>
                    <div className="space-y-3">
                      <Button className="bg-green-500 hover:bg-green-600 text-white">
                        <Download className="ml-2 h-4 w-4" />
                        تحميل الملف المعدل
                      </Button>
                      <Button variant="outline" onClick={resetForm} className="block mx-auto">
                        معالجة ملف جديد
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
