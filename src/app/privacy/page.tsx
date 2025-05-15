import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Your privacy is important to us. It is YadavLab's policy to respect your privacy regarding any information we may collect from you across our website, [Your Website URL for YadavLab], and other sites we own and operate.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">1. Information we collect</h2>
          <p>Log data: When you visit our website, our servers may automatically log the standard data provided by your web browser. This data is considered "non-identifying information."</p>
          <p>Personal information: We may ask you for personal information, such as your name, email, address, contact number, and payment information. This data is considered "identifying information."</p>
          <p>Lab reports: If you use our AI analysis feature, you will upload lab reports. These reports may contain sensitive personal health information. We are committed to handling this data securely and in accordance with applicable laws.</p>
          <p>Appointment Data: When you book an appointment, we collect information such as your name, contact details, address, preferred time, and selected tests. This information is stored securely to manage your booking.</p>


          <h2 className="text-xl font-semibold text-foreground pt-4">2. How we use information</h2>
          <p>We may use your information to:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Provide, operate, and maintain our website and services (including appointment booking and report analysis).</li>
            <li>Manage and confirm your appointments for lab tests.</li>
            <li>Improve, personalize, and expand our website and services.</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes (with your consent).</li>
            <li>Process your transactions (Note: Payment processing details are handled by our secure payment gateway and not stored directly by us, beyond transaction confirmation).</li>
            <li>Find and prevent fraud.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Security of your personal information</h2>
          <p>We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification. We use Firestore for storing appointment data, which provides robust security features.</p>
          <p>While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">4. Data Retention for AI Analysis</h2>
            <p>Lab reports uploaded for AI analysis are processed to provide you with insights. We may temporarily store data as necessary to perform the analysis. We are committed to minimizing data retention and will anonymize or delete reports after a reasonable period or as required by law, unless you explicitly consent to longer storage for your convenience (e.g., for future reference within your account).</p>
          <h2 className="text-xl font-semibold text-foreground pt-4">5. Data Retention for Appointments</h2>
            <p>Appointment data is stored in Firestore to manage your bookings and for your historical reference. We retain this data as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements.</p>


          <h2 className="text-xl font-semibold text-foreground pt-4">6. Your Rights</h2>
          <p>You have the right to access, update, or delete the personal information we have on you. You also have the right to opt-out of certain uses of your information.</p>

          <p className="pt-6">This is a placeholder Privacy Policy for YadavLab. Please replace this with your own comprehensive policy that complies with all applicable laws and regulations (e.g., GDPR, CCPA, Indian data protection laws).</p>
        </CardContent>
      </Card>
    </div>
  );
}
