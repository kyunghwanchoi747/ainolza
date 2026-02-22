'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface ChartData {
  date: string
  visitors: number
  pageViews: number
}

export function StatsChart({ data }: { data: ChartData[] }) {
  const formatted = data.map((d) => ({
    ...d,
    date: d.date.slice(5), // MM-DD
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
        <Area
          type="monotone"
          dataKey="pageViews"
          name="페이지뷰"
          stroke="#3b82f6"
          fill="url(#colorPV)"
          strokeWidth={2}
          dot={{ r: 3, fill: '#3b82f6' }}
        />
        <Area
          type="monotone"
          dataKey="visitors"
          name="방문자"
          stroke="#1e3a8a"
          fill="url(#colorV)"
          strokeWidth={2}
          dot={{ r: 3, fill: '#1e3a8a' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
