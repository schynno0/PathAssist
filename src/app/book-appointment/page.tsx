'use client'; // Required for useSearchParams

import AppointmentForm from '@/components/appointment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function BookAppointmentPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId') || undefined;

  // Find test name from a mock/shared list if needed for display
  // For now, just passing testId to the form

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CalendarPlus className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Book Your Sample Collection</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-1">
            Fill in your details, and our phlebotomist will visit you at your convenience.
            {testId && <span className="block mt-1 font-semibold">Booking for specific test ID: {testId}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm selectedTestId={testId} />
        </CardContent>
      </Card>
    </div>
  );
}
