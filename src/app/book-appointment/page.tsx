
'use client';

import AppointmentForm from '@/components/appointment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus } from 'lucide-react';
import React from 'react';

export default function BookAppointmentPage() {
  // selectedTestId from query params will be handled by the AppointmentForm using the store
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CalendarPlus className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-bold text-primary">Book Your Sample Collection</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-1">
            Confirm your details, select tests if needed, and our phlebotomist will visit you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
