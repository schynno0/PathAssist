import type { AnalyzeLabReportOutput } from '@/ai/flows/analyze-lab-report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Soup, AlertCircle } from 'lucide-react';

interface ReportAnalysisDisplayProps {
  analysis: AnalyzeLabReportOutput | null;
}

export default function ReportAnalysisDisplay({ analysis }: ReportAnalysisDisplayProps) {
  if (!analysis) {
    return null;
  }

  return (
    <Card className="mt-8 w-full shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-bold text-primary">Lab Report Analysis</CardTitle>
        </div>
        <CardDescription className="text-base">{analysis.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        {analysis.deficiencies && analysis.deficiencies.length > 0 ? (
          <>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Identified Deficiencies & Recommendations:</h3>
            <Accordion type="single" collapsible className="w-full">
              {analysis.deficiencies.map((deficiency, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b border-border last:border-b-0">
                  <AccordionTrigger className="text-lg hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span>{deficiency.name}</span>
                      <Badge variant={deficiency.severity.toLowerCase() === 'severe' ? 'destructive' : 'secondary'} className="ml-2 capitalize">
                        {deficiency.severity}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-1">
                    {deficiency.dietaryRecommendations.map((rec, recIndex) => (
                      <div key={recIndex} className="mb-4 p-4 bg-secondary/30 rounded-lg">
                        <h4 className="font-semibold text-md text-primary flex items-center">
                          <Soup className="h-5 w-5 mr-2 text-accent" />
                          Dietary Recommendations for {rec.nutrient}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">Recommended Food Sources (India-specific):</p>
                        <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-sm">
                          {rec.foodSources.map((food, foodIndex) => (
                            <li key={foodIndex}>{food}</li>
                          ))}
                        </ul>
                        {rec.notes && <p className="text-xs text-muted-foreground mt-2 italic">Note: {rec.notes}</p>}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        ) : (
          <p className="text-muted-foreground flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-green-500" />
            No significant deficiencies identified based on the provided report.
          </p>
        )}
        <p className="mt-6 text-xs text-muted-foreground italic">
          Disclaimer: This AI analysis is for informational purposes only and not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health or treatment.
        </p>
      </CardContent>
    </Card>
  );
}
