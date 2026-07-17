'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SkillProgressChart = () => {
  const data = {
    labels: ['Frontend', 'Backend', 'DevOps', 'AI/ML', 'Database'],
    datasets: [
      {
        data: [85, 70, 55, 65, 80],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444',
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        titleColor: '#1f2937',
        bodyColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      },
    },
    cutout: '70%',
  };

  return (
    <div className="relative">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <p className="text-2xl font-bold text-gray-800">72%</p>
        <p className="text-xs text-gray-500">Overall Progress</p>
      </div>
    </div>
  );
};

export default SkillProgressChart; 