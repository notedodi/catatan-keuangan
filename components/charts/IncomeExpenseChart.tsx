"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface IncomeExpenseChartProps {
    data: Array<{
        date: string;
        income: number;
        expense: number;
    }>;
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "currentColor" }}
                />
                <YAxis
                    className="text-xs"
                    tick={{ fill: "currentColor" }}
                    tickFormatter={(value) => formatCurrency(value).replace("Rp", "Rp ")}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Pemasukan"
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Pengeluaran"
                    dot={{ fill: "#ef4444", r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
