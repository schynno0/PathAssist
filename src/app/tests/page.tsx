import TestCard from '@/components/test-card';
import type { Test } from '@/types';
import { Stethoscope, Droplet, Heart, Bone, Microscope, TestTube2 } from 'lucide-react';

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
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <Stethoscope className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-primary">Available Tests & Pricing</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Choose from a wide range of diagnostic tests. Book online for convenient home sample collection.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockTests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}
