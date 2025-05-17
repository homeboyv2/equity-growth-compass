
import React from 'react';
import { useMilestones } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const MilestonesTracker: React.FC = () => {
  const { milestones, currentMilestone, setCurrentMilestone, completeMilestone } = useMilestones();
  
  const handleCompleteMilestone = () => {
    if (!currentMilestone) return;
    
    completeMilestone(currentMilestone.id);
    toast.success(`${currentMilestone.name} milestone completed`);
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestonesTracker;
