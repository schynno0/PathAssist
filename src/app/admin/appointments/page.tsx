
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Lock, IndianRupee, CalendarDays, Clock, User, Phone, MapPin, StickyNote, CheckCircle, ListChecks } from 'lucide-react';
import { format } from 'date-fns';

interface FirestoreTest {
  id: string;
  name: string;
  price: number;
}

interface FirestoreAppointment {
  id: string; // Document ID from Firestore
  userId: string;
  patientName: string;
  contactNumber: string;
  address: string;
  preferredDate: Timestamp;
  preferredTimeSlot: string;
  tests: FirestoreTest[];
  totalCost: number;
  notes?: string;
  bookedAt: Timestamp;
  status: string;
}

// IMPORTANT: This password is for prototype purposes only and is NOT secure.
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"; // Use environment variable or default

export default function AdminAppointmentsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [appointments, setAppointments] = useState<FirestoreAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const q = query(collection(db, 'appointments'), orderBy('bookedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apptsData: FirestoreAppointment[] = [];
      querySnapshot.forEach((doc) => {
        apptsData.push({ id: doc.id, ...doc.data() } as FirestoreAppointment);
      });
      setAppointments(apptsData);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching appointments: ", err);
      setError("Failed to load appointments. Please check console for details.");
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword(''); // Clear password field
    } else {
      alert('Incorrect password.');
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments;
    return appointments.filter(appt =>
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.contactNumber.includes(searchTerm) ||
      appt.tests.some(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [appointments, searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-primary mx-auto mb-3" />
            <CardTitle className="text-2xl font-bold text-primary">Admin Access</CardTitle>
            <CardDescription>Enter password to view appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Login
              </Button>
            </form>
             <p className="mt-4 text-xs text-center text-muted-foreground">
              Note: This is a basic password protection for prototype demonstration.
              Default password: <strong>admin123</strong> (or set via NEXT_PUBLIC_ADMIN_PASSWORD).
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Eye className="h-8 w-8 mr-3" />
          Admin - All Appointments
        </h1>
        <Input
          type="search"
          placeholder="Search by name, contact, or test..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-muted-foreground">Loading appointments...</p>}
      {error && <p className="text-center text-destructive">{error}</p>}

      {!loading && !error && (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Preferred Date & Time</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Booked At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                        No appointments found{searchTerm && " matching your search"}.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredAppointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell>
                        <div className="font-medium flex items-center"><User className="h-4 w-4 mr-1.5 text-muted-foreground"/>{appt.patientName}</div>
                        <div className="text-xs text-muted-foreground">User ID: {appt.userId}</div>
                      </TableCell>
                      <TableCell><Phone className="h-3.5 w-3.5 mr-1 inline-block text-muted-foreground"/>{appt.contactNumber}</TableCell>
                      <TableCell className="max-w-xs truncate"><MapPin className="h-3.5 w-3.5 mr-1 inline-block text-muted-foreground"/>{appt.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5 text-muted-foreground"/>{format(appt.preferredDate.toDate(), 'PPP')}</div>
                        <div className="flex items-center text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5 mr-1.5"/>{appt.preferredTimeSlot}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start">
                          <ListChecks className="h-4 w-4 mr-1.5 mt-0.5 text-muted-foreground shrink-0"/>
                          <ul className="text-xs space-y-0.5">
                            {appt.tests.map(test => (
                              <li key={test.id}>{test.name} (₹{test.price})</li>
                            ))}
                          </ul>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium"><IndianRupee className="h-3.5 w-3.5 mr-0.5 inline-block"/>{appt.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {appt.notes ? <><StickyNote className="h-3.5 w-3.5 mr-1 inline-block text-muted-foreground"/>{appt.notes}</> : <span className="text-muted-foreground/70">N/A</span>}
                      </TableCell>
                       <TableCell>
                        {format(appt.bookedAt.toDate(), 'PP pp')}
                      </TableCell>
                       <TableCell>
                        <Badge variant={appt.status === 'Pending' ? 'secondary' : 'default'}>
                          {appt.status === 'Pending' ? <Clock className="h-3 w-3 mr-1.5" /> : <CheckCircle className="h-3 w-3 mr-1.5" />}
                          {appt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

