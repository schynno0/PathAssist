// Implemented the Genkit flow for analyzing lab reports, identifying deficiencies, and providing dietary recommendations.

'use server';

/**
 * @fileOverview Analyzes lab reports to identify deficiencies and provide dietary recommendations tailored to the Indian context.
 *
 * - analyzeLabReport - A function that handles the lab report analysis process.
 * - AnalyzeLabReportInput - The input type for the analyzeLabReport function.
 * - AnalyzeLabReportOutput - The return type for the analyzeLabReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLabReportInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      "The lab report as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeLabReportInput = z.infer<typeof AnalyzeLabReportInputSchema>;

const DietaryRecommendationSchema = z.object({
  nutrient: z.string().describe('The deficient nutrient.'),
  foodSources: z.array(z.string()).describe('List of Indian food sources rich in the deficient nutrient.'),
  notes: z.string().optional().describe('Additional notes or considerations.'),
});

const DeficiencySchema = z.object({
  name: z.string().describe('The name of the deficiency.'),
  severity: z.string().describe('The severity of the deficiency (e.g., mild, moderate, severe).'),
  dietaryRecommendations: z.array(DietaryRecommendationSchema).describe('Specific dietary recommendations to address the deficiency.'),
});

const AnalyzeLabReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the lab report analysis.'),
  deficiencies: z.array(DeficiencySchema).describe('List of deficiencies identified in the lab report.'),
});
export type AnalyzeLabReportOutput = z.infer<typeof AnalyzeLabReportOutputSchema>;

export async function analyzeLabReport(input: AnalyzeLabReportInput): Promise<AnalyzeLabReportOutput> {
  return analyzeLabReportFlow(input);
}

const analyzeLabReportPrompt = ai.definePrompt({
  name: 'analyzeLabReportPrompt',
  input: {schema: AnalyzeLabReportInputSchema},
  output: {schema: AnalyzeLabReportOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing lab reports and providing dietary recommendations, specifically tailored for individuals in India.

  Analyze the lab report provided and identify any deficiencies. For each deficiency, suggest dietary recommendations with food sources readily available in India.

  Report: {{media url=reportDataUri}}
  `,
});

const analyzeLabReportFlow = ai.defineFlow(
  {
    name: 'analyzeLabReportFlow',
    inputSchema: AnalyzeLabReportInputSchema,
    outputSchema: AnalyzeLabReportOutputSchema,
  },
  async input => {
    const {output} = await analyzeLabReportPrompt(input);
    return output!;
  }
);
