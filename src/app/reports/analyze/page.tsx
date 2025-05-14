'use client';

import React, { useState, useEffect } from 'react';
import ReportUploadForm from '@/components/report-upload-form';
import ReportAnalysisDisplay from '@/components/report-analysis-display';
import type { AnalyzeLabReportOutput } from '@/ai/flows/analyze-lab-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AnalyzeReportPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeLabReportOutput | null>(null);
  const [analysisError, setAnalysisError] = useState<string>('');
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?redirect=/reports/analyze');
    }
  }, [user, authLoading, router]);

  const handleAnalysisComplete = (analysis: AnalyzeLabReportOutput) => {
    setAnalysisResult(analysis);
    setAnalysisError('');
  };

  const handleAnalysisError = (errorMsg: string) => {
    setAnalysisError(errorMsg);
    setAnalysisResult(null); // Clear previous results if any
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <FlaskConical className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-lg text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }

  if (!user) {
     // This case should ideally be handled by the redirect, but as a fallback:
    return (
      <div className="container mx-auto py-8 px-4 text-center min-h-[calc(100vh-8rem)] flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to analyze reports.</p>
        <Button asChild>
          <Link href="/auth/signin?redirect=/reports/analyze">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="md:sticky md:top-24"> {/* Makes the form sticky on larger screens */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <FlaskConical className="h-12 w-12 text-primary mx-auto mb-3" />
              <CardTitle className="text-3xl font-bold text-primary">Analyze Your Lab Report</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">
                Upload your lab report (PDF, JPG, or PNG) to get AI-powered insights and dietary recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportUploadForm onAnalysisComplete={handleAnalysisComplete} onAnalysisError={handleAnalysisError} />
            </CardContent>
          </Card>
        </div>

        <div className="md:mt-0 mt-8"> {/* Adds margin top on mobile, aligning with form on desktop */}
          {analysisError && (
            <Card className="mb-6 border-destructive bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Analysis Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive/90">{analysisError}</p>
              </CardContent>
            </Card>
          )}
          {analysisResult ? (
            <ReportAnalysisDisplay analysis={analysisResult} />
          ) : (
            !analysisError && (
            <Card className="border-dashed border-2 border-border min-h-[300px] flex flex-col justify-center items-center text-center p-8">
              <Image src="https://placehold.co/300x200.png" alt="Waiting for report" width={300} height={200} className="opacity-50 mb-4 rounded" data-ai-hint="report document"/>
              <h3 className="text-xl font-semibold text-muted-foreground">Awaiting Report Upload</h3>
              <p className="text-sm text-muted-foreground mt-1">Your analysis results will appear here once you upload a report.</p>
            </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
