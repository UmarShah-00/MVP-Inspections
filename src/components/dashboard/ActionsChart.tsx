"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { name: "Open", actions: 8 },
  { name: "In Progress", actions: 5 },
  { name: "Closed", actions: 16 },
];

export default function ActionsChart() {
  return (
    <>
      <h3>Actions Status Overview</h3>
      <div style={{ width: "100%", height: 260, marginTop: 16 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="actions" fill="#000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
