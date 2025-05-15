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
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Test } from '@/types';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Mock tests data - in a real app, this would come from a prop or API/DB
const mockTests: Pick<Test, 'id' | 'name' | 'price'>[] = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 350 },
  { id: 'lft', name: 'Liver Function Test (LFT)', price: 700 },
  { id: 'kft', name: 'Kidney Function Test (KFT)', price: 650 },
  { id: 'lipid', name: 'Lipid Profile', price: 800 },
  { id: 'thyroid', name: 'Thyroid Profile (T3, T4, TSH)', price: 900 },
  { id: 'sugar', name: 'Blood Sugar (Fasting & PP)', price: 250 },
  { id: 'vitd', name: 'Vitamin D Test', price: 1200 },
  { id: 'vitb12', name: 'Vitamin B12 Test', price: 1000 },
  { id: 'urine', name: 'Urine Routine & Microscopy', price: 200 },
  { id: 'hba1c', name: 'HbA1c (Glycated Hemoglobin)', price: 550 },
];

const appointmentFormSchema = z.object({
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  contactNumber: z.string().regex(/^\d{10}$/, { message: 'Must be a valid 10-digit phone number.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  preferredDate: z.date({ required_error: 'Preferred date is required.' }),
  preferredTimeSlot: z.string({ required_error: 'Preferred time slot is required.' }),
  testIds: z.array(z.string()).min(1, { message: 'Please select at least one test.' }),
  notes: z.string().optional(),
});

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
      testIds: selectedTestId ? [selectedTestId] : [],
      notes: '',
    },
  });
  
  useEffect(() => {
    if (user && !form.getValues('patientName')) {
      form.setValue('patientName', user.displayName || '');
    }
    if (selectedTestId && !form.getValues('testIds').includes(selectedTestId)) {
      form.setValue('testIds', [selectedTestId]);
    }
  }, [user, selectedTestId, form]);


  async function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book an appointment.',
        variant: 'destructive',
      });
      router.push(`/auth/signin?redirect=/book-appointment${values.testIds.length > 0 ? `?testId=${values.testIds[0]}` : ''}`);
      return;
    }
    
    try {
      const selectedTestDetails = values.testIds.map(id => {
        const test = mockTests.find(t => t.id === id);
        return test ? { id: test.id, name: test.name, price: test.price } : null;
      }).filter(Boolean);

      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        patientName: values.patientName,
        contactNumber: values.contactNumber,
        address: values.address,
        preferredDate: values.preferredDate,
        preferredTimeSlot: values.preferredTimeSlot,
        tests: selectedTestDetails, // Storing details of selected tests
        notes: values.notes,
        bookedAt: serverTimestamp(),
        status: 'Pending', // Initial status
      });

      console.log('Appointment Data for Admin:', { ...values, userId: user.uid, tests: selectedTestDetails, status: 'Pending' });
      // TODO: Implement actual admin notification (e.g., email, dashboard update)

      toast({
        title: 'Appointment Booked!',
        description: (
          <div>
            <p>Thank you, {values.patientName}. Your appointment is confirmed.</p>
            <p>Selected Tests: {selectedTestDetails.map(t => t?.name).join(', ')}</p>
            <p>Date: {format(values.preferredDate, 'PPP')}</p>
            <p>Time Slot: {values.preferredTimeSlot}</p>
            <p className="mt-2 text-sm">Further details will be sent to your contact number and email.</p>
          </div>
        ),
        variant: 'default',
        duration: 7000,
      });
      form.reset({
        patientName: user?.displayName || '',
        contactNumber: '',
        address: '',
        preferredDate: undefined,
        preferredTimeSlot: '',
        testIds: [],
        notes: '',
      });
      router.push('/reports'); 
    } catch (error) {
      console.error("Error booking appointment: ", error);
      toast({
        title: 'Booking Failed',
        description: 'Could not save your appointment. Please try again.',
        variant: 'destructive',
      });
    }
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
                    <SelectItem value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</SelectItem>
                    <SelectItem value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</SelectItem>
                    <SelectItem value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</SelectItem>
                    <SelectItem value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</SelectItem>
                    <SelectItem value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</SelectItem>
                    <SelectItem value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</SelectItem>
                    <SelectItem value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</SelectItem>
                    <SelectItem value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</SelectItem>
                    <SelectItem value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</SelectItem>
                    <SelectItem value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="testIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select Test(s)</FormLabel>
                <FormDescription>
                  Choose one or more tests for your appointment.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {mockTests.map((test) => (
                  <FormField
                    key={test.id}
                    control={form.control}
                    name="testIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={test.id}
                          className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md border border-transparent hover:border-primary/50 transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(test.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                return checked
                                  ? field.onChange([...currentValues, test.id])
                                  : field.onChange(
                                      currentValues.filter(
                                        (value) => value !== test.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm cursor-pointer flex-grow">
                            {test.name} (₹{test.price})
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any specific instructions or information for the phlebotomist." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
           <Send className="mr-2 h-5 w-5" />
          Confirm Appointment
        </Button>
      </form>
    </Form>
  );
}
