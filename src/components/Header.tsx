
import React, { useState } from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Header: React.FC = () => {
  const { resetApp } = useMilestones();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleReset = () => {
    resetApp();
    setIsOpen(false);
  };
  
  return (
    <motion.header 
      className="bg-white shadow-sm py-4 px-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <AnimatedLogo />
        
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </motion.div>
          
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all co-founders, equity distributions, and history data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
