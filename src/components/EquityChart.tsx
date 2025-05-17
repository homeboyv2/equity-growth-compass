
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Founder } from '@/types';

interface EquityChartProps {
  founders: Founder[];
}

const EquityChart: React.FC<EquityChartProps> = ({ founders }) => {
  if (founders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 text-center mb-2">
          No co-founders added yet
        </p>
        <p className="text-sm text-gray-400 text-center">
          Add co-founders to visualize equity distribution
        </p>
      </div>
    );
  }

  const data = founders.map((founder) => ({
    name: founder.name,
    value: founder.equityPercentage,
    color: founder.color,
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

  return (
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
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)}%`} 
          separator=": "
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EquityChart;
