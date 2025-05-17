
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Founder } from '@/types';
import { motion } from 'framer-motion';
import { useContributionWeights } from '@/context/AppContext';

interface EquityChartProps {
  founders: Founder[];
}

const EquityChart: React.FC<EquityChartProps> = ({ founders }) => {
  const { weights } = useContributionWeights();

  if (founders.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-500 text-center mb-2">
          No co-founders added yet
        </p>
        <p className="text-sm text-gray-400 text-center">
          Add co-founders to visualize equity distribution
        </p>
      </motion.div>
    );
  }

  const data = founders.map((founder) => ({
    name: founder.name,
    value: founder.equityPercentage,
    color: founder.color,
    criteriaScore: Object.values(founder.scores).reduce((sum, score) => sum + score, 0),
    contributionScore: (founder.contributions || []).reduce((sum, contribution) => {
      return sum + (contribution.amount * weights[contribution.type]);
    }, 0)
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, cy, midAngle, innerRadius, outerRadius, percent 
  }: { 
    cx: number; 
    cy: number; 
    midAngle: number; 
    innerRadius: number; 
    outerRadius: number; 
    percent: number; 
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium" style={{ color: data.color }}>{data.name}</p>
          <p className="text-sm">Equity: <span className="font-bold">{data.value.toFixed(2)}%</span></p>
          <div className="mt-1 pt-1 border-t border-gray-200 text-xs">
            <p>Criteria Score: {data.criteriaScore}</p>
            <p>Contributions: {data.contributionScore.toFixed(1)}</p>
            <p>Total: {(data.criteriaScore + data.contributionScore).toFixed(1)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            fill="#8884d8"
            animationDuration={1500}
            animationBegin={300}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default EquityChart;
