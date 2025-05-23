import type { LucideIcon } from 'lucide-react';

export interface Test {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: LucideIcon;
  category: string;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AppointmentFormData {
  patientName: string;
  contactNumber: string;
  address: string;
  preferredDate: Date;
  preferredTimeSlot: string;
  testIds: string[]; // Changed from testId to testIds
  notes?: string; // Optional field for any specific notes
}

export interface ReportAnalysis {
  summary: string;
  deficiencies: {
    name: string;
    severity: string;
    dietaryRecommendations: {
      nutrient: string;
      foodSources: string[];
      notes?: string;
    }[];
  }[];
}
