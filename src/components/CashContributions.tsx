
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFounders } from '@/context/AppContext';
import { Founder } from '@/types';
import { motion } from 'framer-motion';

const CashContributions: React.FC = () => {
  const { founders, updateFounder } = useFounders();

  const handleContributionChange = (
    founder: Founder, 
    type: keyof Founder['contributions'], 
    value: string
  ) => {
    const numValue = parseFloat(value);
    const validValue = isNaN(numValue) ? 0 : Math.max(0, numValue);
    
    const updatedFounder = {
      ...founder,
      contributions: {
        ...founder.contributions,
        [type]: validValue
      }
    };
    
    updateFounder(updatedFounder);
  };

  if (founders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Founder Contributions</CardTitle>
          <CardDescription>No co-founders added yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add co-founders to record their contributions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Founder Contributions</CardTitle>
          <CardDescription>
            Record each founder's contributions across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {founders.map((founder) => (
              <div key={founder.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: founder.color }}
                  />
                  <h3 className="font-medium">{founder.name}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`cash-${founder.id}`}>Cash ($)</Label>
                    <Input
                      id={`cash-${founder.id}`}
                      type="number"
                      min="0"
                      step="1000"
                      value={founder.contributions?.cash || 0}
                      onChange={(e) => handleContributionChange(founder, 'cash', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`time-${founder.id}`}>Time (hours/week)</Label>
                    <Input
                      id={`time-${founder.id}`}
                      type="number"
                      min="0"
                      step="1"
                      max="168"
                      value={founder.contributions?.time || 0}
                      onChange={(e) => handleContributionChange(founder, 'time', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`skills-${founder.id}`}>Skills (0-10)</Label>
                    <Input
                      id={`skills-${founder.id}`}
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={founder.contributions?.skills || 0}
                      onChange={(e) => handleContributionChange(founder, 'skills', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CashContributions;
