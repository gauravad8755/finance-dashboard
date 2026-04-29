import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart({ expenses }) {
  return (
    <BarChart width={400} height={300} data={expenses}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" />
    </BarChart>
  );
}
