import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FlaskConical, CalendarCheck, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: 'Easy Appointment Booking',
    description: 'Select your preferred date, time, and location for sample collection effortlessly.',
    link: '/book-appointment',
    linkLabel: 'Book Now'
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: 'Instant Report Delivery',
    description: 'Receive your lab reports directly on WhatsApp as soon as they are ready.',
    link: '/reports',
    linkLabel: 'View Reports'
  },
  {
    icon: <FlaskConical className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Analysis',
    description: 'Get insightful analysis of your lab reports with dietary recommendations tailored for you.',
    link: '/reports/analyze',
    linkLabel: 'Analyze Report'
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Welcome to YadavLab
            </h1>
            <p className="text-lg md:text-xl text-foreground mb-8">
              Your trusted partner for convenient lab testing, quick report delivery, and intelligent health insights.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/book-appointment">Book a Test</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link href="/tests">View All Tests</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">How YadavLab Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Choose Your Test(s)</h3>
              <p className="text-muted-foreground">Browse our comprehensive list of tests and select what you need.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <CalendarCheck className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Book Appointment</h3>
              <p className="text-muted-foreground">Schedule a convenient time for sample collection from your home.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Reports & Insights</h3>
              <p className="text-muted-foreground">Receive reports via WhatsApp and use our AI tool for analysis.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Our Core Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90">
                    <Link href={feature.link}>{feature.linkLabel}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for visual element */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-card p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-primary mb-4">Health Insights at Your Fingertips</h2>
              <p className="text-muted-foreground mb-6">
                YadavLab empowers you with easy access to lab services and AI-driven analysis, helping you take proactive steps towards better health.
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/auth/signin">Get Started</Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Medical Professional"
                width={600}
                height={400}
                className="rounded-lg object-cover"
                data-ai-hint="medical lab"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
