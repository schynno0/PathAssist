import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Welcome to PathAssist!</p>
          <p>These terms and conditions outline the rules and regulations for the use of PathAssist's Website, located at [Your Website URL].</p>
          <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use PathAssist if you do not agree to take all of the terms and conditions stated on this page.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">1. Intellectual Property Rights</h2>
          <p>Other than the content you own, under these Terms, PathAssist and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">2. Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul className="list-disc list-inside pl-4">
            <li>publishing any Website material in any other media;</li>
            <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
            <li>publicly performing and/or showing any Website material;</li>
            <li>using this Website in any way that is or may be damaging to this Website;</li>
            <li>using this Website in any way that impacts user access to this Website;</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">3. AI Report Analysis</h2>
            <p>The AI report analysis feature provides information for educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Limitation of liability</h2>
          <p>In no event shall PathAssist, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. PathAssist, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">5. Governing Law & Jurisdiction</h2>
          <p>These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.</p>
          
          <p className="pt-6">This is a placeholder Terms of Service. Please replace this with your own comprehensive terms.</p>
        </CardContent>
      </Card>
    </div>
  );
}
