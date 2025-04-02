
import React from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Header: React.FC = () => {
  const { resetApp } = useMilestones();
  
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">EGC</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Equity Growth Compass</h1>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={resetApp}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
