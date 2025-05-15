
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CalendarIcon, Send, TestTube2Icon, IndianRupee, ListPlus, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Test } from '@/types';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useTestSelectionStore } from '@/hooks/use-test-selection-store';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Mock tests data - this should ideally be fetched or from a shared config
const allAvailableTests: Pick<Test, 'id' | 'name' | 'price' | 'category'>[] = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 350, category: 'Hematology' },
  { id: 'lft', name: 'Liver Function Test (LFT)', price: 700, category: 'Biochemistry' },
  { id: 'kft', name: 'Kidney Function Test (KFT)', price: 650, category: 'Biochemistry' },
  { id: 'lipid', name: 'Lipid Profile', price: 800, category: 'Cardiology' },
  { id: 'thyroid', name: 'Thyroid Profile (T3, T4, TSH)', price: 900, category: 'Endocrinology' },
  { id: 'sugar', name: 'Blood Sugar (Fasting & PP)', price: 250, category: 'Diabetes Care' },
  { id: 'vitd', name: 'Vitamin D Test', price: 1200, category: 'Vitamins & Minerals' },
  { id: 'vitb12', name: 'Vitamin B12 Test', price: 1000, category: 'Vitamins & Minerals' },
  { id: 'urine', name: 'Urine Routine & Microscopy', price: 200, category: 'Pathology' },
  { id: 'hba1c', name: 'HbA1c (Glycated Hemoglobin)', price: 550, category: 'Diabetes Care' },
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

export default function AppointmentForm() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { selectedTestIds: storeTestIds, tests: storeSelectedTests, clearSelection, addTest, removeTest } = useTestSelectionStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isTestSelectionDialogOpen, setIsTestSelectionDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: user?.displayName || '',
      contactNumber: '',
      address: '',
      preferredDate: undefined,
      preferredTimeSlot: '',
      testIds: storeTestIds,
      notes: '',
    },
  });

  useEffect(() => {
    // Sync form with user details
    if (user && !form.getValues('patientName')) {
      form.setValue('patientName', user.displayName || '');
    }

    // Initialize tests from store or query param (legacy single test booking)
    const queryTestId = searchParams.get('testId');
    let initialTestIds = [...storeTestIds];

    if (queryTestId && !initialTestIds.includes(queryTestId)) {
      const testToAdd = allAvailableTests.find(t => t.id === queryTestId);
      if (testToAdd) {
        addTest(testToAdd); // Add to store if coming from direct link
        initialTestIds.push(queryTestId); // Ensure it's in the local list for form init
      }
    }
    form.setValue('testIds', initialTestIds);

  }, [user, storeTestIds, searchParams, form, addTest]);

  // Watch for changes in form's testIds and sync back to store if needed
  // This might be complex if dialog directly manipulates form. Simpler: dialog reads from store, writes to store, form reads from store.
  // For now, let's assume the dialog updates the form value, and the store is the source of truth before form load.
  const watchedTestIds = form.watch('testIds');

  const currentSelectedTestsDetails = useMemo(() => {
    return watchedTestIds
      .map(id => allAvailableTests.find(t => t.id === id))
      .filter((test): test is Pick<Test, 'id' | 'name' | 'price'> => !!test);
  }, [watchedTestIds]);
  
  const totalCost = useMemo(() => {
    return currentSelectedTestsDetails.reduce((sum, test) => sum + test.price, 0);
  }, [currentSelectedTestsDetails]);


  async function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book an appointment.',
        variant: 'destructive',
      });
      const redirectQuery = values.testIds.length > 0 ? `?testId=${values.testIds[0]}` : ''; // Or pass all selected
      router.push(`/auth/signin?redirect=/book-appointment${redirectQuery}`);
      return;
    }
    
    try {
      const selectedTestDetailsForDB = values.testIds.map(id => {
        const test = allAvailableTests.find(t => t.id === id);
        return test ? { id: test.id, name: test.name, price: test.price } : null;
      }).filter(Boolean);

      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        patientName: values.patientName,
        contactNumber: values.contactNumber,
        address: values.address,
        preferredDate: values.preferredDate,
        preferredTimeSlot: values.preferredTimeSlot,
        tests: selectedTestDetailsForDB,
        totalCost: totalCost,
        notes: values.notes,
        bookedAt: serverTimestamp(),
        status: 'Pending', 
      });

      console.log('Appointment Data for Admin:', { ...values, userId: user.uid, tests: selectedTestDetailsForDB, totalCost, status: 'Pending' });
      // TODO: Implement actual admin notification (e.g., email, dashboard update)

      toast({
        title: 'Appointment Booked!',
        description: (
          <div>
            <p>Thank you, {values.patientName}. Your appointment is confirmed.</p>
            <p>Selected Tests: {selectedTestDetailsForDB.map(t => t?.name).join(', ')} (Total: ₹{totalCost.toFixed(2)})</p>
            <p>Date: {format(values.preferredDate, 'PPP')}</p>
            <p>Time Slot: {values.preferredTimeSlot}</p>
            <p className="mt-2 text-sm">Further details will be sent to your contact number and email.</p>
          </div>
        ),
        variant: 'default',
        duration: 7000,
      });
      clearSelection(); // Clear the cart/selection from Zustand store
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

  const timeSlots = [];
    for (let hour = 7; hour < 19; hour++) { // 7 AM to 6 PM (ends before 7 PM)
        const ampm = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        timeSlots.push(`${String(displayHour).padStart(2, '0')}:00 ${ampm} - ${String(displayHour).padStart(2, '0')}:30 ${ampm}`);
        timeSlots.push(`${String(displayHour).padStart(2, '0')}:30 ${ampm} - ${String(hour === 11 ? 12 : (displayHour + 1 > 12 ? 1 : displayHour +1) % 13).padStart(2, '0')}:00 ${hour === 11 ? 'PM' : (hour + 1 >=12 && hour+1 < 23 ? 'PM' : 'AM')}`);
    }
     // Fix last slot for 6:30 PM - 7:00 PM
    const lastSlotIndex = timeSlots.findIndex(slot => slot.startsWith("06:30 PM"));
    if (lastSlotIndex !== -1) {
        timeSlots[lastSlotIndex] = "06:30 PM - 07:00 PM";
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
                    {timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormLabel className="text-base">Selected Test(s)</FormLabel>
          {currentSelectedTestsDetails.length === 0 ? (
             <div className="mt-2 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                No tests selected. Please add tests to proceed.
              </div>
          ) : (
            <Card className="mt-2">
              <CardContent className="p-4 space-y-2">
                {currentSelectedTestsDetails.map(test => (
                  <div key={test.id} className="flex justify-between items-center text-sm">
                    <span>{test.name}</span>
                    <span className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5" />{test.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center font-semibold text-md border-t pt-2 mt-2">
                  <span>Total Cost</span>
                  <span className="flex items-center"><IndianRupee className="h-4 w-4 mr-0.5" />{totalCost.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}
          <Dialog open={isTestSelectionDialogOpen} onOpenChange={setIsTestSelectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4 w-full md:w-auto">
                <ListPlus className="mr-2 h-4 w-4" />
                {currentSelectedTestsDetails.length > 0 ? 'Modify Selected Tests' : 'Select Tests'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Select Tests</DialogTitle>
                <DialogDescription>
                  Choose one or more tests for your appointment.
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="testIds"
                render={({ field: formField }) => ( // Renamed field to formField to avoid conflict
                  <FormItem>
                    <ScrollArea className="h-[300px] border rounded-md p-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 p-2">
                      {allAvailableTests.map((test) => (
                        <FormItem
                          key={test.id}
                          className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md border border-transparent hover:border-primary/50 transition-colors"
                        >
                          <FormControl>
                            <Checkbox
                              checked={formField.value?.includes(test.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = formField.value || [];
                                const newValues = checked
                                  ? [...currentValues, test.id]
                                  : currentValues.filter((value) => value !== test.id);
                                formField.onChange(newValues); // Update form state
                                // Sync with Zustand store
                                if (checked) {
                                  addTest(test);
                                } else {
                                  removeTest(test.id);
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm cursor-pointer flex-grow">
                            {test.name} (₹{test.price}) <span className="text-xs text-muted-foreground">({test.category})</span>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button onClick={() => setIsTestSelectionDialogOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {form.formState.errors.testIds && <FormMessage className="mt-2">{form.formState.errors.testIds.message}</FormMessage>}
        </div>
        
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

        <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={currentSelectedTestsDetails.length === 0}>
           <Send className="mr-2 h-5 w-5" />
          Confirm Appointment
        </Button>
      </form>
    </Form>
  );
}
