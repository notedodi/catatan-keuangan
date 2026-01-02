"use client";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, LogOut, Moon, Sun, Mail } from "lucide-react";

export default function SettingsPage() {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        if (confirm("Yakin ingin logout?")) {
            try {
                await signOut();
            } catch (error) {
                console.error("Error logging out:", error);
            }
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Pengaturan</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Kelola akun dan preferensi Anda
                </p>
            </div>

            {/* Account Info */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="w-5 h-5" />
                        Informasi Akun
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <p className="font-medium text-sm sm:text-base truncate">{user?.email}</p>
                        </div>
                    </div>
                    {user?.displayName && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <Label className="text-xs text-muted-foreground">Display Name</Label>
                                <p className="font-medium text-sm sm:text-base truncate">{user.displayName}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Tema</CardTitle>
                    <CardDescription>Pilih tema tampilan aplikasi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                            {theme === "dark" ? (
                                <Moon className="w-5 h-5 text-primary" />
                            ) : (
                                <Sun className="w-5 h-5 text-primary" />
                            )}
                            <div>
                                <Label className="text-sm font-medium">Dark Mode</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {theme === "dark" ? "Aktif" : "Nonaktif"}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            className="gap-2"
                        >
                            {theme === "dark" ? (
                                <>
                                    <Sun className="w-4 h-4" />
                                    <span className="hidden sm:inline">Light</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Dark</span>
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Logout */}
            <Card className="shadow-sm border-destructive/20">
                <CardHeader>
                    <CardTitle className="text-lg text-destructive">Logout</CardTitle>
                    <CardDescription>Keluar dari akun Anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="gap-2 w-full sm:w-auto"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
