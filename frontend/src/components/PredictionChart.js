import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box } from '@mui/material';

const PredictionChart = ({ probabilities }) => {
  if (!probabilities) return null;
  const translateClassName = (className) => {
    switch (className) {
      case 'Healthy': return 'Saine';
      case 'Early Blight': return 'Mildiou Précoce';
      case 'Late Blight': return 'Brûlure Tardive';
      default: return className;
    }
  };

  const data = Object.entries(probabilities).map(([className, probability]) => ({
    class: translateClassName(className),
    probability: (probability * 100).toFixed(1),
    value: probability * 100,
  }));
  const getBarColor = (className) => {
    switch (className) {
      case 'Saine': return '#4caf50';
      case 'Mildiou Précoce': return '#ff9800';
      case 'Brûlure Tardive': return '#f44336';
      default: return '#2196f3';
    }
  };  return (
    <Box sx={{ width: '100%', height: 220, minWidth: '500px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 40, left: 40, bottom: 50 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="class" 
            fontSize={13}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 13 }}
          />
          <YAxis 
            domain={[0, 100]} 
            tickFormatter={(value) => `${value}%`}
            fontSize={13}
            width={60}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Probabilité']}
            labelStyle={{ color: '#333' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '13px'
            }}
          />          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            maxBarSize={80}
          >
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
