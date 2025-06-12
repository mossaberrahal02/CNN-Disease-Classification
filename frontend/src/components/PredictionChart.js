import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box } from '@mui/material';

const PredictionChart = ({ probabilities }) => {
  if (!probabilities) return null;

  const data = Object.entries(probabilities).map(([className, probability]) => ({
    class: className,
    probability: (probability * 100).toFixed(1),
    value: probability * 100,
  }));

  const getBarColor = (className) => {
    switch (className) {
      case 'Healthy': return '#4caf50';
      case 'Early Blight': return '#ff9800';
      case 'Late Blight': return '#f44336';
      default: return '#2196f3';
    }
  };

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="class" fontSize={12} />
          <YAxis 
            domain={[0, 100]} 
            tickFormatter={(value) => `${value}%`}
            fontSize={12}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Probability']}
            labelStyle={{ color: '#333' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.class)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PredictionChart;
