
'use client';
import React, { useState, useMemo } from 'react';
import TestCard from '@/components/test-card';
import type { Test } from '@/types';
import { Stethoscope, Droplet, Heart, Bone, Microscope, TestTube2, Search, ShoppingCart, CalendarCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTestSelectionStore } from '@/hooks/use-test-selection-store';

// Mock data for tests
const mockTests: Test[] = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', description: 'Measures different components of your blood.', price: 350, icon: Droplet, category: 'Hematology' },
  { id: 'lft', name: 'Liver Function Test (LFT)', description: 'Assesses the health of your liver.', price: 700, icon: TestTube2, category: 'Biochemistry' },
  { id: 'kft', name: 'Kidney Function Test (KFT)', description: 'Evaluates how well your kidneys are working.', price: 650, icon: TestTube2, category: 'Biochemistry' },
  { id: 'lipid', name: 'Lipid Profile', description: 'Measures cholesterol and triglyceride levels.', price: 800, icon: Heart, category: 'Cardiology' },
  { id: 'thyroid', name: 'Thyroid Profile (T3, T4, TSH)', description: 'Checks thyroid gland function.', price: 900, icon: TestTube2, category: 'Endocrinology' },
  { id: 'sugar', name: 'Blood Sugar (Fasting & PP)', description: 'Monitors blood glucose levels.', price: 250, icon: Droplet, category: 'Diabetes Care' },
  { id: 'vitd', name: 'Vitamin D Test', description: 'Measures Vitamin D levels in blood.', price: 1200, icon: Bone, category: 'Vitamins & Minerals' },
  { id: 'vitb12', name: 'Vitamin B12 Test', description: 'Measures Vitamin B12 levels.', price: 1000, icon: TestTube2, category: 'Vitamins & Minerals' },
  { id: 'urine', name: 'Urine Routine & Microscopy', description: 'Analyzes urine for various conditions.', price: 200, icon: Microscope, category: 'Pathology' },
  { id: 'hba1c', name: 'HbA1c (Glycated Hemoglobin)', description: 'Average blood sugar over past 2-3 months.', price: 550, icon: Droplet, category: 'Diabetes Care' },
];


export default function TestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedTestIds } = useTestSelectionStore();

  const filteredTests = useMemo(() => {
    if (!searchTerm) return mockTests;
    return mockTests.filter(test =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <Stethoscope className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-primary">Available Tests & Pricing</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Select tests to add to your cart and proceed to booking.
        </p>
      </div>

      <div className="mb-8 max-w-xl mx-auto sticky top-20 z-10 bg-background py-2"> {/* Make search and book button sticky */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tests by name, category, or description..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedTestIds.length > 0 && (
          <Button asChild size="lg" className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/book-appointment">
              <ShoppingCart className="mr-2 h-5 w-5" />
              View Cart & Book ({selectedTestIds.length} item{selectedTestIds.length === 1 ? '' : 's'})
            </Link>
          </Button>
        )}
      </div>
      
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4"> {/* Add padding top to avoid overlap */}
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">No tests found matching your search criteria.</p>
      )}
    </div>
  );
}
