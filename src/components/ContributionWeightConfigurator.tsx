
import React from 'react';
import { useContributionWeights } from '@/context/AppContext';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ContributionType } from '@/types';
import { motion } from 'framer-motion';

const ContributionWeightConfigurator: React.FC = () => {
  const { weights, updateContributionWeight } = useContributionWeights();

  const handleWeightChange = (type: ContributionType, value: number[]) => {
    updateContributionWeight(type, value[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Contribution Weights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="cash-weight">
                Cash Investment
              </Label>
              <span className="text-sm font-medium">×{weights.cash.toFixed(1)}</span>
            </div>
            <Slider
              id="cash-weight"
              defaultValue={[weights.cash]}
              min={0.1}
              max={3}
              step={0.1}
              onValueChange={(value) => handleWeightChange('cash', value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Direct financial investments in the startup
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="time-weight">
                Time Investment
              </Label>
              <span className="text-sm font-medium">×{weights.time.toFixed(1)}</span>
            </div>
            <Slider
              id="time-weight"
              defaultValue={[weights.time]}
              min={0.1}
              max={3}
              step={0.1}
              onValueChange={(value) => handleWeightChange('time', value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Hours dedicated to building the company
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="skills-weight">
                Skills & Resources
              </Label>
              <span className="text-sm font-medium">×{weights.skills.toFixed(1)}</span>
            </div>
            <Slider
              id="skills-weight"
              defaultValue={[weights.skills]}
              min={0.1}
              max={3}
              step={0.1}
              onValueChange={(value) => handleWeightChange('skills', value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Expertise, connections, and resources provided
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContributionWeightConfigurator;
