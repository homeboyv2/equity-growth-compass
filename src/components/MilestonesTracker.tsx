
import React, { useState } from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

const MilestonesTracker: React.FC = () => {
  const { milestones, currentMilestone, setCurrentMilestone, completeMilestone, updateMilestoneWeight } = useMilestones();
  const [showWeights, setShowWeights] = useState(false);
  
  const handleCompleteMilestone = () => {
    if (!currentMilestone) return;
    
    completeMilestone(currentMilestone.id);
    toast.success(`${currentMilestone.name} milestone completed`);
  };

  const handleWeightChange = (id: string, weight: number[]) => {
    updateMilestoneWeight(id, weight[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Startup Growth Stages</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowWeights(!showWeights)}
            className="flex items-center gap-1"
          >
            {showWeights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span>{showWeights ? 'Hide Weights' : 'Configure Weights'}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCompleteMilestone}
            disabled={!currentMilestone}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            <span>Complete Current</span>
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showWeights && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Milestone Impact Weights</h3>
              <p className="text-xs text-gray-500 mb-4">
                Adjust how much each milestone impacts the equity distribution. Higher weights give more influence to a milestone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="space-y-2 p-3 bg-white rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{milestone.name}</span>
                      <span className="text-sm font-bold">×{milestone.weight.toFixed(1)}</span>
                    </div>
                    <Slider 
                      defaultValue={[milestone.weight]}
                      min={0.1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => handleWeightChange(milestone.id, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex overflow-x-auto pb-4 gap-0 mt-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative flex-1 min-w-[120px]">
            {/* Connector line */}
            {index < milestones.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
            )}
            
            {/* Milestone node */}
            <button
              onClick={() => setCurrentMilestone(milestone.id)}
              className={`
                relative z-10 mx-auto mb-3 flex items-center justify-center 
                w-8 h-8 rounded-full border-2 
                ${milestone.completed 
                  ? 'bg-primary border-primary text-white' 
                  : milestone.current 
                    ? 'bg-white border-primary text-primary' 
                    : 'bg-white border-gray-300 text-gray-400'}
              `}
              disabled={milestone.completed}
            >
              {milestone.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </button>
            
            {/* Milestone label */}
            <div className="text-center px-1">
              <p className={`text-xs font-medium ${
                milestone.current ? 'text-primary' : 
                milestone.completed ? 'text-primary' : 'text-gray-500'
              }`}>
                {milestone.name}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 hidden sm:block">
                {milestone.description}
              </p>
              {showWeights && (
                <p className="text-[10px] font-medium text-primary mt-1">
                  ×{milestone.weight.toFixed(1)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestonesTracker;
