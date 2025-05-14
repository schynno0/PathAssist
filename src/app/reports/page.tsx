import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for past reports - in a real app, this would be fetched
const mockPastReports = [
  { id: 'rep001', testName: 'Complete Blood Count', date: '2023-10-15', status: 'Ready' },
  { id: 'rep002', testName: 'Lipid Profile', date: '2023-11-02', status: 'Ready' },
  { id: 'rep003', testName: 'Thyroid Profile', date: '2023-11-20', status: 'Processing' },
];

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-primary">Your Lab Reports</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Access your reports and gain valuable health insights.
        </p>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-accent" />
            <CardTitle className="text-2xl text-primary">Report Delivery via WhatsApp</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your lab reports will be automatically sent to your registered WhatsApp number upon payment completion and report generation. 
            Please ensure your contact information is up to date.
          </p>
          <div className="flex items-center justify-center">
            <Image src="https://placehold.co/300x150.png" alt="WhatsApp integration" width={300} height={150} className="rounded-md" data-ai-hint="chat bubbles"/>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-accent" />
              <CardTitle className="text-2xl text-primary">AI-Powered Report Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload your lab report to get an AI-driven analysis, identify potential deficiencies, and receive dietary recommendations tailored to the Indian context.
            </p>
            <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/reports/analyze">Analyze Your Report</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Past Reports</CardTitle>
            <CardDescription>View your previously generated reports here.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockPastReports.length > 0 ? (
              <ul className="space-y-3">
                {mockPastReports.map((report) => (
                  <li key={report.id} className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                    <div>
                      <p className="font-semibold">{report.testName}</p>
                      <p className="text-sm text-muted-foreground">Date: {report.date}</p>
                    </div>
                    <Button variant={report.status === 'Ready' ? 'default' : 'outline'} size="sm" disabled={report.status !== 'Ready'}>
                      {report.status === 'Ready' ? 'Download' : 'Processing'}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No past reports found. Once your reports are ready, they will appear here and also be sent to your WhatsApp.</p>
            )}
          </CardContent>
        </Card>
      </div>
       <p className="mt-12 text-center text-sm text-muted-foreground">
        Payment processing for tests will be handled securely through our integrated payment gateway. You will be prompted for payment after booking an appointment.
      </p>
    </div>
  );
}
