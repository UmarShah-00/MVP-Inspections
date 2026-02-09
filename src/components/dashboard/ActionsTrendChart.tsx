"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STATUS_COLORS: Record<string,string> = { Open:"#fa541c","In Progress":"#f59e0b",Closed:"#52c41a" };

export default function ActionsTrendChart({ data }: { data:any[] }) {
  const formatted = data.map(d=>({
    month: d.month || "Unknown",
    Open: d.Open || 0,
    "In Progress": d["In Progress"] || 0,
    Closed: d.Closed || 0
  }));

  return (
    <div className="chartCard">
      <h3 className="chartCardTitle">Actions Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formatted}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {["Open","In Progress","Closed"].map(status=>(
            <Line key={status} type="monotone" dataKey={status} stroke={STATUS_COLORS[status]} strokeWidth={2} activeDot={{ r:5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
