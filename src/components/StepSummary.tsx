
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Founder, Milestone } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StepSummaryProps {
  milestone: Milestone;
  founders: Founder[];
}

const StepSummary: React.FC<StepSummaryProps> = ({ milestone, founders }) => {
  // Sort founders by equity percentage descending
  const sortedFounders = [...founders].sort((a, b) => b.equityPercentage - a.equityPercentage);
  
  const pieData = sortedFounders.map((founder) => ({
    name: founder.name,
    value: founder.equityPercentage,
    color: founder.color,
  }));
  
  // Calculate total contribution score for this milestone
  const totalContributionScore = founders.reduce((total, founder) => {
    const criteriaTotal = Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
    return total + criteriaTotal;
  }, 0);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            {milestone.name} Equity Summary
            {milestone.weight !== 1.0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Weight: {milestone.weight.toFixed(2)}x)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Equity Distribution</h3>
              <div className="h-[200px]">
                {founders.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        labelLine={false}
                        label={({cx, cy, midAngle, innerRadius, outerRadius, percent}) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                          const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                          
                          return percent > 0.05 ? (
                            <text 
                              x={x} 
                              y={y} 
                              fill="white" 
                              textAnchor="middle" 
                              dominantBaseline="central"
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {`${(percent * 100).toFixed(1)}%`}
                            </text>
                          ) : null;
                        }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <h3 className="text-sm font-medium">Contribution Scores</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Co-founder</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFounders.map((founder) => {
                    const founderScore = Object.values(founder.scores).reduce(
                      (sum, score) => sum + score, 0
                    );
                    const percentage = (founderScore / totalContributionScore) * 100;
                    
                    return (
                      <TableRow key={founder.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: founder.color }}
                            />
                            {founder.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{founderScore.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{percentage.toFixed(2)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{totalContributionScore.toFixed(1)}</TableCell>
                    <TableCell className="text-right">100.00%</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StepSummary;
