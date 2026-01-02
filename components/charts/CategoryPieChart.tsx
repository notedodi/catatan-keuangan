"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CategoryPieChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                Belum ada data pengeluaran
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
