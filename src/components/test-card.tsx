
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Test } from '@/types';
import { IndianRupee, TestTube2, PlusCircle, MinusCircle } from 'lucide-react';
import { useTestSelectionStore } from '@/hooks/use-test-selection-store';

interface TestCardProps {
  test: Test;
}

export default function TestCard({ test }: TestCardProps) {
  const IconComponent = test.icon || TestTube2;
  const { addTest, removeTest, isTestSelected } = useTestSelectionStore();
  constisSelected = isTestSelected(test.id);

  const handleToggleSelection = () => {
    if (isSelected) {
      removeTest(test.id);
    } else {
      addTest({ id: test.id, name: test.name, price: test.price });
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto sm:max-w-none">
      <CardHeader className="pb-1 pt-3 px-4">
         <div className="flex justify-between items-start">
          <CardTitle className="text-md font-semibold text-primary leading-tight h-12 overflow-hidden flex-grow pr-2">
            {test.name}
          </CardTitle>
          <div className="bg-primary/10 text-primary p-1.5 rounded-md">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-2 pt-1">
         <CardDescription className="text-xs text-muted-foreground h-10 overflow-hidden mb-2">
          {test.description}
        </CardDescription>
        <div className="flex items-center text-lg font-semibold text-accent">
          <IndianRupee className="h-4 w-4 mr-0.5" />
          {test.price.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Category: {test.category}</p>
      </CardContent>
      <CardFooter className="px-4 pb-3 pt-2">
        <Button 
          onClick={handleToggleSelection} 
          variant={isSelected ? "outline" : "default"}
          className="w-full text-sm py-1.5 h-auto"
        >
          {isSelected ? <MinusCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {isSelected ? 'Remove from Cart' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
