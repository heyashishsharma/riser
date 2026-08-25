"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function DashboardCharts({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4a3aff" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#4a3aff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis 
           dataKey="date" 
           axisLine={false}
           tickLine={false}
           tick={{ fill: '#9ca3af', fontSize: 12 }}
           dy={10}
        />
        <YAxis 
           axisLine={false}
           tickLine={false}
           tick={{ fill: '#9ca3af', fontSize: 12 }}
           dx={-10}
        />
        <Tooltip 
           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Area 
           type="monotone" 
           dataKey="viralPotential" 
           name="Viral Potential (%)"
           stroke="#4a3aff" 
           strokeWidth={3}
           fillOpacity={1} 
           fill="url(#colorViral)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
