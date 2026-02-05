"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", open: 4, closed: 10 },
  { month: "Feb", open: 6, closed: 12 },
  { month: "Mar", open: 8, closed: 16 },
  { month: "Apr", open: 5, closed: 14 },
];

export default function ActionsTrendChart() {
  return (
    <>
      <h3>Actions Trend</h3>
      <div style={{ width: "100%", height: 260, marginTop: 16 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="open" stroke="#FF4D4F" />
            <Line type="monotone" dataKey="closed" stroke="#52C41A" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
