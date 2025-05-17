
import React from 'react';
import { Milestone, Founder } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMilestones } from '@/context/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StepSummaryProps {
  milestone: Milestone;
  founders: Founder[];
}

const StepSummary: React.FC<StepSummaryProps> = ({ milestone, founders }) => {
  const { updateMilestoneWeight } = useMilestones();

  const handleWeightChange = (value: number[]) => {
    updateMilestoneWeight(milestone.id, value[0]);
  };

  // Calculate total contribution amounts per type
  const calculateContributionTotals = () => {
    const totals = {
      cash: 0,
      time: 0,
      skills: 0,
    };

    founders.forEach(founder => {
      if (founder.contributions) {
        founder.contributions.forEach(contribution => {
          totals[contribution.type] += contribution.amount;
        });
      }
    });

    return totals;
  };

  const contributionTotals = calculateContributionTotals();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{milestone.name}</CardTitle>
          <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {milestone.completed 
              ? "Completed" 
              : milestone.current 
                ? "In Progress" 
                : "Upcoming"}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Step Weight</label>
            <span className="text-sm font-medium">{milestone.weight.toFixed(1)}x</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Adjust how much this milestone influences the equity distribution
          </p>
          <Slider
            value={[milestone.weight]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={handleWeightChange}
            disabled={milestone.completed}
          />
        </div>
        
        {founders.length > 0 && (
          <>
            <div className="py-2">
              <h3 className="text-sm font-medium mb-3">Equity Distribution</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Co-founder</TableHead>
                    <TableHead className="text-right">Equity %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {founders.map((founder) => (
                    <TableRow key={founder.id}>
                      <TableCell className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: founder.color }}
                        />
                        {founder.name}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {founder.equityPercentage.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="py-2">
              <h3 className="text-sm font-medium mb-3">Contribution Summary</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Cash Invested</TableCell>
                    <TableCell className="text-right">
                      ${contributionTotals.cash.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Time Contributed</TableCell>
                    <TableCell className="text-right">
                      {contributionTotals.time.toLocaleString()} hours
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skills/Resources</TableCell>
                    <TableCell className="text-right">
                      {contributionTotals.skills.toLocaleString()} units
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="py-2">
              <h3 className="text-sm font-medium mb-3">Individual Contributions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Co-founder</TableHead>
                    <TableHead className="text-right">Cash</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                    <TableHead className="text-right">Skills</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {founders.map((founder) => {
                    // Calculate totals per founder per type
                    const founderTotals = {
                      cash: 0,
                      time: 0,
                      skills: 0
                    };
                    
                    if (founder.contributions) {
                      founder.contributions.forEach(c => {
                        founderTotals[c.type] += c.amount;
                      });
                    }
                    
                    return (
                      <TableRow key={founder.id}>
                        <TableCell className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: founder.color }}
                          />
                          {founder.name}
                        </TableCell>
                        <TableCell className="text-right">
                          ${founderTotals.cash.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {founderTotals.time.toLocaleString()} h
                        </TableCell>
                        <TableCell className="text-right">
                          {founderTotals.skills.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        
        {founders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-gray-400">
              No founder data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StepSummary;
