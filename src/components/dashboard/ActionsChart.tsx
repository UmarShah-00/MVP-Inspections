"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS: Record<string,string> = { Open:"#fa541c","In Progress":"#f59e0b",Closed:"#52c41a" };

export default function ActionsChart({ data }: { data: { name:string, actions:number }[] }) {
  return (
    <div className="chartCard">
      <h3 className="chartCardTitle">Actions Status</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="actions">
            {data.map((entry,i)=><Cell key={i} fill={COLORS[entry.name] || "#1677ff"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
