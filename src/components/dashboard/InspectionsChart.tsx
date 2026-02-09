"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#1677ff","#52c41a","#faad14","#fa541c","#13c2c2","#722ed1","#eb2f96","#fa8c16"];

interface CategoryData { name:string; value:number }

export default function InspectionsChart({ data }: { data:CategoryData[] }) {
  const filteredData = data.filter(d => d.name && d.value>0);

  return (
    <div className="chartCard">
      <h3 className="chartCardTitle">Inspections by Category</h3>
      {filteredData.length===0 ? <p className="chartCardEmpty">No categories to display</p> :
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={filteredData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60} paddingAngle={4} label={({name,percent})=>`${name}: ${(percent*100).toFixed(0)}%`} labelLine={true}>
            {filteredData.map((entry,index)=><Cell key={index} fill={COLORS[index%COLORS.length]} stroke="#fff" strokeWidth={2} />)}
          </Pie>
          <Tooltip formatter={(value:number,name:string)=>[value,name]} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>}
    </div>
  );
}
