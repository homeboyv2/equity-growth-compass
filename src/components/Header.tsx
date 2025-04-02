
import React from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { resetApp } = useMilestones();
  
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <AnimatedLogo />
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={resetApp}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
