
import React from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Check, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

const MilestonesTracker: React.FC = () => {
  const { milestones, currentMilestone, setCurrentMilestone, completeMilestone, updateMilestoneWeight } = useMilestones();
  
  const handleCompleteMilestone = () => {
    if (!currentMilestone) return;
    
    completeMilestone(currentMilestone.id);
    toast.success(`${currentMilestone.name} milestone completed`);
  };

  const handleWeightChange = (id: string, value: number[]) => {
    updateMilestoneWeight(id, value[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Startup Growth Stages</h2>
        <div className="flex space-x-2">
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
      
      <div className="flex overflow-x-auto pb-4 gap-0 mt-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative flex-1 min-w-[120px]">
            {/* Connector line */}
            {index < milestones.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
            )}
            
            <div className="flex flex-col items-center">
              {/* Milestone node */}
              <button
                onClick={() => setCurrentMilestone(milestone.id)}
                className={`
                  relative z-10 mb-2 flex items-center justify-center 
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
              
              {/* Milestone weight indicator */}
              {milestone.weight !== 1 && (
                <div className="absolute top-0 right-1/4 -mt-1">
                  <div className={`
                    text-[10px] px-1 rounded-full
                    ${milestone.weight > 1 ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {milestone.weight}x
                  </div>
                </div>
              )}
              
              {/* Settings dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    className={`
                      absolute top-8 right-1/4 -mt-1 rounded-full p-0.5 
                      ${milestone.current ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
                    `}
                  >
                    <Sliders className="h-3 w-3" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Adjust {milestone.name} Weight</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Increasing the weight makes this milestone more important in equity calculations.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Weight</span>
                        <span className="text-sm font-medium">{milestone.weight.toFixed(1)}x</span>
                      </div>
                      <Slider
                        value={[milestone.weight]}
                        min={0.1}
                        max={5}
                        step={0.1}
                        onValueChange={(value) => handleWeightChange(milestone.id, value)}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1x</span>
                        <span>5.0x</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestonesTracker;
