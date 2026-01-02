"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Receipt,
    History,
    PieChart,
    Settings,
} from "lucide-react";

const mobileNavItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaksi", href: "/dashboard/transactions", icon: Receipt },
    { name: "Riwayat", href: "/dashboard/history", icon: History },
    { name: "Laporan", href: "/dashboard/reports", icon: PieChart },
    { name: "Setting", href: "/dashboard/settings", icon: Settings },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16 px-2">
                {mobileNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-[64px]",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground active:scale-95"
                            )}
                        >
                            <item.icon className={cn(
                                "w-6 h-6 transition-all",
                                isActive && "scale-110"
                            )} />
                            <span className={cn(
                                "text-[10px] font-medium",
                                isActive && "font-semibold"
                            )}>
                                {item.name}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
