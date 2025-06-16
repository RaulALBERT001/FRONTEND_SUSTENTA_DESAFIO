import { Link, useLocation } from "wouter";
import { Leaf, Trophy, Plus, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Desafios", href: "/dashboard", icon: Trophy },
    { name: "Novo Desafio", href: "/desafios/novo", icon: Plus },
  ];

  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  return (
    <div className={cn("flex flex-col h-full bg-white shadow-lg", className)}>
      <div className="flex items-center justify-center h-16 bg-primary">
        <div className="flex items-center">
          <Leaf className="text-white text-xl mr-2" />
          <span className="text-white text-lg font-semibold">Sustenta Desafios</span>
        </div>
      </div>

      <nav className="mt-8 flex-1">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "text-white bg-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={onNavigate}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm font-medium">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700">{user?.username}</p>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center mt-1"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
