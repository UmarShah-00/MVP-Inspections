"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STATUS_COLORS: Record<string,string> = { Open:"#fa541c","In Progress":"#f59e0b",Closed:"#52c41a" };

export default function ActionsTrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p>No trend data available</p>;

  return (
    <div className="chartCard">
      <h3 className="chartCardTitle">Actions Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {["Open","In Progress","Closed"].map(status => (
            <Line key={status} type="monotone" dataKey={status} stroke={STATUS_COLORS[status]} strokeWidth={2} activeDot={{ r:5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
