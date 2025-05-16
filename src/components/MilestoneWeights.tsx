
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMilestones } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Milestone } from '@/types';

const MilestoneWeights: React.FC = () => {
  const { milestones, updateMilestoneWeight } = useMilestones();
  
  const handleWeightChange = (milestone: Milestone, value: number[]) => {
    updateMilestoneWeight(milestone.id, value[0]);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Milestone Weights</CardTitle>
          <CardDescription>
            Adjust weights to give more or less importance to specific milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor={`milestone-${milestone.id}`} className="text-sm font-medium">
                  {milestone.name}
                  <span className="text-xs ml-2 text-muted-foreground">
                    {milestone.completed ? '(Completed)' : milestone.current ? '(Current)' : '(Pending)'}
                  </span>
                </Label>
                <span className="text-sm font-mono">
                  {milestone.weight.toFixed(2)}x
                </span>
              </div>
              <Slider
                id={`milestone-${milestone.id}`}
                min={0.1}
                max={3}
                step={0.1}
                value={[milestone.weight]}
                onValueChange={(value) => handleWeightChange(milestone, value)}
                className={milestone.current ? "[&>span:first-child]:bg-blue-500" : milestone.completed ? "[&>span:first-child]:bg-green-500" : "[&>span:first-child]:bg-gray-400"}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MilestoneWeights;
