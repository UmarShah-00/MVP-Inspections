"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Site", value: 10 },
  { name: "Activity", value: 8 },
  { name: "Asset", value: 6 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function InspectionsChart() {
  return (
    <>
      <h3>Inspections by Category</h3>
      <div style={{ width: "100%", height: 260, marginTop: 16 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
