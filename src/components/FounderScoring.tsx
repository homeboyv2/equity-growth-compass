
import React from 'react';
import { useFounders } from '@/context/AppContext';
import { Founder, CRITERIA } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';

interface FounderScoringProps {
  founder: Founder;
}

const FounderScoring: React.FC<FounderScoringProps> = ({ founder }) => {
  const { updateFounder, removeFounder } = useFounders();

  const handleScoreChange = (criterionId: string, value: number) => {
    const updatedFounder = { 
      ...founder, 
      scores: { 
        ...founder.scores, 
        [criterionId]: value 
      } 
    };
    updateFounder(updatedFounder);
  };

  return (
    <Card className="border-t-4" style={{ borderTopColor: founder.color }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{founder.name}</CardTitle>
            <p className="text-sm text-gray-500">{founder.role}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-destructive"
            onClick={() => removeFounder(founder.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-right mb-2">
          <div className="inline-flex items-center text-xs text-gray-500">
            <span className="mr-1">Low</span>
            <div className="flex space-x-1">
              {[0, 2, 4, 6, 8, 10].map(val => (
                <div key={val} className="w-3 text-center">{val}</div>
              ))}
            </div>
            <span className="ml-1">High</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {CRITERIA.map(criterion => (
            <div key={criterion.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{criterion.label}</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <HelpCircle className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-xs">
                      {criterion.description}
                    </PopoverContent>
                  </Popover>
                </div>
                <span className="text-sm font-semibold">{founder.scores[criterion.id as keyof typeof founder.scores]}</span>
              </div>
              
              <input
                type="range"
                className="criteria-slider"
                min="0"
                max="10"
                step="1"
                value={founder.scores[criterion.id as keyof typeof founder.scores]}
                onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Score</span>
            <span className="text-lg font-bold">
              {Object.values(founder.scores).reduce((sum, score) => sum + score, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium">Equity Share</span>
            <span className="text-lg font-bold text-primary">
              {founder.equityPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FounderScoring;
