
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Calendar, ChevronFirst, ChevronLast, BarChart3, Home, TicketIcon, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'New Entry', path: '/entry', icon: TicketIcon },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Analytics', path: '/analytics', icon: Calendar },
  ];

  return (
    <AppProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Sidebar */}
        <aside 
          className={cn(
            "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
            collapsed ? "w-16" : "w-64"
          )}
        >
          {/* Logo */}
          <div className={cn(
            "flex h-16 items-center border-b px-4 bg-basketball-orange",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white p-1">
                  <div className="h-6 w-6 bg-basketball-orange rounded-full"></div>
                </div>
                <span className="text-xl font-bold text-white">HoopEntry</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-sidebar-accent"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronLast /> : <ChevronFirst />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 font-medium transition-colors",
                      isActivePath(item.path)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                      collapsed ? "justify-center" : ""
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className={cn(
            "border-t p-4",
            collapsed ? "text-center" : ""
          )}>
            {!collapsed && (
              <p className="text-xs text-sidebar-foreground/70">
                © 2025 HoopEntry
              </p>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between border-b px-4 py-2 bg-white">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-basketball-orange p-1">
                <div className="h-5 w-5 bg-white rounded-full"></div>
              </div>
              <span className="text-lg font-bold">HoopEntry</span>
            </div>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default AppLayout;
