'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { analyzeLabReport, type AnalyzeLabReportInput, type AnalyzeLabReportOutput } from '@/ai/flows/analyze-lab-report';
import { Loader2, UploadCloud, AlertTriangle } from 'lucide-react';

interface FormValues {
  reportFile: FileList;
}

interface ReportUploadFormProps {
  onAnalysisComplete: (analysis: AnalyzeLabReportOutput) => void;
  onAnalysisError: (error: string) => void;
}

export default function ReportUploadForm({ onAnalysisComplete, onAnalysisError }: ReportUploadFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.reportFile || data.reportFile.length === 0) {
      toast({
        title: 'No file selected',
        description: 'Please select a lab report file to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    onAnalysisError(''); // Clear previous errors

    const file = data.reportFile[0];

    // Check file type and size (optional, but good practice)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, JPG, or PNG file.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }


    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const input: AnalyzeLabReportInput = { reportDataUri: base64data };
        
        try {
          const analysisResult = await analyzeLabReport(input);
          onAnalysisComplete(analysisResult);
          toast({
            title: 'Analysis Complete',
            description: 'Your lab report has been analyzed successfully.',
          });
          reset(); // Reset form including file input
          setFileName(null); 
        } catch (e: any) {
          console.error('AI Analysis Error:', e);
          const errorMessage = e.message || 'Failed to analyze report. The AI model might be unavailable or the report format is not supported.';
          onAnalysisError(errorMessage);
          toast({
            title: 'Analysis Failed',
            description: errorMessage,
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        console.error('File reading error');
        toast({
          title: 'File Error',
          description: 'Could not read the selected file.',
          variant: 'destructive',
        });
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Submission Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="reportFile" className="text-base font-medium">Upload Lab Report</Label>
        <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-border px-6 pt-5 pb-6 hover:border-primary transition-colors">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="flex text-sm text-muted-foreground">
              <label
                htmlFor="reportFile"
                className="relative cursor-pointer rounded-md bg-background font-medium text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
              >
                <span>Upload a file</span>
                <Input 
                  id="reportFile" 
                  type="file" 
                  className="sr-only" 
                  {...register('reportFile', { required: 'A lab report file is required.' })}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</p>
          </div>
        </div>
        {fileName && <p className="mt-2 text-sm text-muted-foreground">Selected file: {fileName}</p>}
        {errors.reportFile && (
          <p className="mt-2 text-sm text-destructive flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1"/> {errors.reportFile.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze Report'
        )}
      </Button>
    </form>
  );
}
