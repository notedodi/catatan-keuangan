import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export default function SummaryCard({
    title,
    value,
    icon: Icon,
    trend,
    className
}: SummaryCardProps) {
    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-base sm:text-2xl font-bold break-words">{value}</div>
                {trend && (
                    <p className={cn(
                        "text-xs mt-1",
                        trend.isPositive ? "text-green-600" : "text-red-600"
                    )}>
                        {trend.isPositive ? "+" : ""}{trend.value}% dari bulan lalu
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
