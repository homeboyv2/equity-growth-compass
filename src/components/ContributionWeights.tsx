
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useContributionWeights } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

const ContributionWeights: React.FC = () => {
  const { contributionWeights, updateContributionWeight } = useContributionWeights();
  
  const handleCashWeightChange = (value: number[]) => {
    updateContributionWeight('cash', value[0]);
  };
  
  const handleTimeWeightChange = (value: number[]) => {
    updateContributionWeight('time', value[0]);
  };
  
  const handleSkillsWeightChange = (value: number[]) => {
    updateContributionWeight('skills', value[0]);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Contribution Weights</CardTitle>
          <CardDescription>
            Adjust weights to reflect the relative importance of different contribution types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="cash-weight" className="text-sm font-medium">
                Cash Contributions
              </Label>
              <span className="text-sm font-mono">
                {contributionWeights.cash.toFixed(2)}x
              </span>
            </div>
            <Slider
              id="cash-weight"
              min={0}
              max={3}
              step={0.1}
              value={[contributionWeights.cash]}
              onValueChange={handleCashWeightChange}
              className="[&>span:first-child]:bg-emerald-500"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="time-weight" className="text-sm font-medium">
                Time Investments
              </Label>
              <span className="text-sm font-mono">
                {contributionWeights.time.toFixed(2)}x
              </span>
            </div>
            <Slider
              id="time-weight"
              min={0}
              max={3}
              step={0.1}
              value={[contributionWeights.time]}
              onValueChange={handleTimeWeightChange}
              className="[&>span:first-child]:bg-blue-500"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label htmlFor="skills-weight" className="text-sm font-medium">
                Skills & Expertise
              </Label>
              <span className="text-sm font-mono">
                {contributionWeights.skills.toFixed(2)}x
              </span>
            </div>
            <Slider
              id="skills-weight"
              min={0}
              max={3}
              step={0.1}
              value={[contributionWeights.skills]}
              onValueChange={handleSkillsWeightChange}
              className="[&>span:first-child]:bg-purple-500"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContributionWeights;
