import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  // Basic form submission handler (does not actually send email)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Thank you for your message! We will get back to you soon. (This is a demo, no email was sent)");
    // In a real app, you would handle form submission here (e.g., API call)
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Contact Us</h1>
        <p className="text-lg text-muted-foreground mt-2">
          We're here to help! Reach out to us with any questions or concerns.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Get in Touch</CardTitle>
            <CardDescription>
              You can reach us through the following channels:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-accent" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:support@pathassist.example.com" className="text-muted-foreground hover:text-primary">
                  support@pathassist.example.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-accent" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+91 123 456 7890</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-accent" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-muted-foreground">
                  123 Health St, Wellness City, India 500001
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Your Name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" type="text" placeholder="Inquiry about..." required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." required rows={5} className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
