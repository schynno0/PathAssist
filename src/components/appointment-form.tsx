'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { AppointmentFormData, Test } from '@/types';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const appointmentFormSchema = z.object({
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  contactNumber: z.string().regex(/^\d{10}$/, { message: 'Must be a valid 10-digit phone number.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  preferredDate: z.date({ required_error: 'Preferred date is required.' }),
  preferredTimeSlot: z.string({ required_error: 'Preferred time slot is required.' }),
  testId: z.string().optional(), // Can be optional if user selects from a general booking form
});

// Mock tests data - in a real app, this would come from a prop or API
const mockTests: Pick<Test, 'id' | 'name'>[] = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)'},
  { id: 'lft', name: 'Liver Function Test (LFT)'},
  { id: 'kft', name: 'Kidney Function Test (KFT)'},
  { id: 'lipid', name: 'Lipid Profile'},
  { id: 'thyroid', name: 'Thyroid Profile (T3, T4, TSH)'},
];


interface AppointmentFormProps {
  selectedTestId?: string;
}

export default function AppointmentForm({ selectedTestId }: AppointmentFormProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: user?.displayName || '',
      contactNumber: '',
      address: '',
      preferredDate: undefined,
      preferredTimeSlot: '',
      testId: selectedTestId || '',
    },
  });
  
  useEffect(() => {
    if (user && !form.getValues('patientName')) {
      form.setValue('patientName', user.displayName || '');
    }
    if (selectedTestId) {
      form.setValue('testId', selectedTestId);
    }
  }, [user, selectedTestId, form]);


  function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    // TODO: Implement actual appointment booking logic (e.g., API call)
    console.log('Appointment Data:', values);

    // Check if user is logged in
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book an appointment.',
        variant: 'destructive',
      });
      router.push(`/auth/signin?redirect=/book-appointment${selectedTestId ? `?testId=${selectedTestId}` : ''}`);
      return;
    }
    
    // Simulate API call
    toast({
      title: 'Appointment Booked!',
      description: (
        <div>
          <p>Thank you, {values.patientName}. Your appointment for {mockTests.find(t => t.id === values.testId)?.name || 'selected test(s)'} is confirmed.</p>
          <p>Date: {format(values.preferredDate, 'PPP')}</p>
          <p>Time Slot: {values.preferredTimeSlot}</p>
          <p className="mt-2 text-sm">Further details will be sent to your contact number and email.</p>
        </div>
      ),
      variant: 'default', // Use 'default' which is often green or positive in themes. Or specify accent color.
      duration: 7000,
    });
    form.reset();
    router.push('/reports'); // Navigate to a confirmation or reports page
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="10-digit mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address for Sample Collection</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your complete address including landmarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preferredTimeSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time Slot</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Morning (8 AM - 11 AM)">Morning (8 AM - 11 AM)</SelectItem>
                    <SelectItem value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</SelectItem>
                    <SelectItem value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         {!selectedTestId && (
            <FormField
            control={form.control}
            name="testId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Test</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a test (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockTests.map(test => (
                         <SelectItem key={test.id} value={test.id}>{test.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  If you selected a test previously, it might be pre-filled.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
         )}


        <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
           <Send className="mr-2 h-5 w-5" />
          Confirm Appointment
        </Button>
      </form>
    </Form>
  );
}
