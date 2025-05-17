
import React from 'react';
import { 
  Milestone, 
  Founder, 
  ContributionType 
} from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell 
} from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useContributionWeights } from '@/context/AppContext';

interface StepSummaryProps {
  milestone: Milestone;
  founders: Founder[];
}

interface ContributionSummary {
  type: ContributionType;
  total: number;
  weighted: number;
}

const StepSummary: React.FC<StepSummaryProps> = ({ milestone, founders }) => {
  const { weights } = useContributionWeights();

  // Calculate contribution summaries
  const getFounderContributionSummary = (founder: Founder): ContributionSummary[] => {
    const summary: Record<ContributionType, ContributionSummary> = {
      cash: { type: 'cash', total: 0, weighted: 0 },
      time: { type: 'time', total: 0, weighted: 0 },
      skills: { type: 'skills', total: 0, weighted: 0 }
    };

    (founder.contributions || []).forEach(contribution => {
      summary[contribution.type].total += contribution.amount;
      summary[contribution.type].weighted += contribution.amount * weights[contribution.type];
    });

    return Object.values(summary);
  };

  // Calculate criteria scores
  const getFounderCriteriaScore = (founder: Founder): number => {
    return Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
  };

  // Prepare pie chart data
  const equityData = founders.map(founder => ({
    name: founder.name,
    value: founder.equityPercentage,
    color: founder.color
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {milestone.name} Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {founders.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              No founders available to analyze
            </div>
          ) : (
            <div className="space-y-6">
              {/* Milestone Information */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-md bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Milestone Weight</p>
                  <p className="text-2xl font-bold">×{milestone.weight.toFixed(1)}</p>
                </div>
                <div className="p-4 rounded-md bg-gray-50">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-2xl font-bold">
                    {milestone.completed ? 'Completed' : milestone.current ? 'Current' : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Equity Distribution Chart */}
              <div className="h-[200px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equityData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ value }) => `${value.toFixed(1)}%`}
                    >
                      {equityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Contributions Table */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Detailed Contributions</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Founder</TableHead>
                      <TableHead>Criteria Score</TableHead>
                      <TableHead>Cash</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead className="text-right">Equity %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {founders.map(founder => {
                      const contributionSummary = getFounderContributionSummary(founder);
                      const criteriaScore = getFounderCriteriaScore(founder);
                      
                      return (
                        <TableRow key={founder.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: founder.color }}
                              ></div>
                              {founder.name}
                            </div>
                          </TableCell>
                          <TableCell>{criteriaScore}</TableCell>
                          {contributionSummary.map(summary => (
                            <TableCell key={summary.type}>
                              {summary.total > 0 ? (
                                <div>
                                  <div>{summary.total}</div>
                                  <div className="text-xs text-gray-500">
                                    ×{weights[summary.type]} = {summary.weighted}
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {founder.equityPercentage.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StepSummary;
