import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Test } from '@/types';
import { IndianRupee, TestTube2 } from 'lucide-react';
import Image from 'next/image';

interface TestCardProps {
  test: Test;
}

export default function TestCard({ test }: TestCardProps) {
  const IconComponent = test.icon || TestTube2;
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto sm:max-w-none">
      <div className="relative w-full h-32 bg-secondary overflow-hidden">
        <Image 
          src={`https://placehold.co/300x150.png?text=${test.name.replace(/\s+/g, '+')}`} 
          alt={test.name} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint="medical test"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
         <div className="absolute top-2 right-2 bg-primary/70 text-primary-foreground p-1.5 rounded-md">
          <IconComponent className="h-5 w-5" />
        </div>
      </div>
      <CardHeader className="pb-1 pt-3 px-4">
        <CardTitle className="text-md font-semibold text-primary leading-tight h-12 overflow-hidden"> {/* Fixed height for title */}
          {test.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-2 pt-1">
         <CardDescription className="text-xs text-muted-foreground h-10 overflow-hidden mb-2"> {/* Fixed height for description */}
          {test.description}
        </CardDescription>
        <div className="flex items-center text-lg font-semibold text-accent">
          <IndianRupee className="h-4 w-4 mr-0.5" />
          {test.price.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Category: {test.category}</p>
      </CardContent>
      <CardFooter className="px-4 pb-3 pt-2">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm py-1.5 h-auto">
          <Link href={`/book-appointment?testId=${test.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
