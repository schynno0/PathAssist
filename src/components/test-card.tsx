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
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-40 bg-secondary overflow-hidden">
        <Image 
          src={`https://placehold.co/400x200.png?text=${test.name.replace(/\s+/g, '+')}`} 
          alt={test.name} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint="medical test"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
         <div className="absolute top-3 right-3 bg-primary/80 text-primary-foreground p-2 rounded-md">
          <IconComponent className="h-6 w-6" />
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-primary">{test.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden">
          {test.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-2xl font-semibold text-accent">
          <IndianRupee className="h-6 w-6 mr-1" />
          {test.price.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Category: {test.category}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/book-appointment?testId=${test.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
